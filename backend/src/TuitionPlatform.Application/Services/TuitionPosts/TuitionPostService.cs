using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.TuitionPosts;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.TuitionPosts;

public class TuitionPostService : ITuitionPostService
{
    private readonly IUserRepository _userRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TuitionPostService(
        IUserRepository userRepository,
        ITuitionPostRepository tuitionPostRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<TuitionPostDto> CreateAsync(Guid userId, CreateTuitionPostRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new NotFoundException("User", userId);

        if (user.Role != UserRole.Admin && user.Role != UserRole.Parent)
        {
            throw new ForbiddenException("Only admins and parents can create vacancies.");
        }

        var post = new TuitionPost
        {
            CreatedByUserId = userId,
            Subject = request.Subject,
            ClassLevel = request.ClassLevel,
            City = request.City,
            Area = request.Area,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Mode = Enum.TryParse<TeachingMode>(request.Mode, true, out var mode) ? mode : TeachingMode.Online,
            Budget = request.Budget,
            Schedule = request.Schedule,
            Description = request.Description,
            // Was never set at all previously, so every post's phone number was blank — the exact
            // field the commission paywall (ContactVisibility) is supposed to be protecting.
            ParentPhoneNumber = request.ParentPhoneNumber ?? user.PhoneNumber ?? string.Empty,
            Status = TuitionPostStatus.Open
        };

        await _tuitionPostRepository.AddAsync(post, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<TuitionPostDto>(post);
        dto.ParentPhoneNumber = post.ParentPhoneNumber; // creator sees their own number back
        return dto;
    }

    public async Task<TuitionPostDto> UpdateStatusAsync(Guid userId, Guid postId, UpdateTuitionPostStatusRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new NotFoundException("User", userId);

        var post = await _tuitionPostRepository.GetByIdAsync(postId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", postId);

        if (user.Role != UserRole.Admin)
        {
            throw new ForbiddenException("Only admins can update status.");
        }

        if (!Enum.TryParse<TuitionPostStatus>(request.Status, true, out var desiredStatus))
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["status"] = new[] { "Invalid status value." }
            });
        }

        post.Status = desiredStatus;
        _tuitionPostRepository.Update(post);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TuitionPostDto>(post);
    }

    public async Task<PagedResult<TuitionPostDto>> GetMyPostsAsync(Guid userId, PagedRequest request, CancellationToken cancellationToken = default)
    {
        // Was ListAsync + in-memory Skip/Take — loaded every post the parent ever created just to
        // return one page of 10. ListPagedAsync pushes Skip/Take/Count into the SQL query.
        var (items, total) = await _tuitionPostRepository.ListPagedAsync(
            p => p.CreatedByUserId == userId, request.Page, request.PageSize, cancellationToken);

        var paged = items.Select(p =>
        {
            var dto = _mapper.Map<TuitionPostDto>(p);
            // Every row is filtered to CreatedByUserId == userId above, so the requester is
            // always the post owner here — always safe to reveal their own contact number.
            dto.ParentPhoneNumber = p.ParentPhoneNumber;
            return dto;
        }).ToList();

        return new PagedResult<TuitionPostDto>
        {
            Items = paged,
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<PagedResult<TuitionPostDto>> GetOpenPostsAsync(PagedRequest request, CancellationToken cancellationToken = default)
    {
        var result = await _tuitionPostRepository.SearchAsync(
            TuitionPostStatus.Open,
            city: null,
            subject: null,
            classLevel: null,
            page: request.Page,
            pageSize: request.PageSize,
            cancellationToken);

        // [AllowAnonymous] endpoint — ParentPhoneNumber must never appear here. AutoMapper
        // already ignores the field (see ApplicationProfile), so this map leaves it blank.
        return new PagedResult<TuitionPostDto>
        {
            Items = result.Items.Select(_mapper.Map<TuitionPostDto>).ToList(),
            TotalCount = result.TotalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<PagedResult<TuitionPostDto>> GetAllPostsAsync(PagedRequest request, CancellationToken cancellationToken = default)
    {
        // Was ListAsync(null) — loaded the entire TuitionPosts table on every page view.
        var (items, total) = await _tuitionPostRepository.ListPagedAsync(null, request.Page, request.PageSize, cancellationToken);

        var paged = items.Select(p =>
        {
            var dto = _mapper.Map<TuitionPostDto>(p);
            // Controller restricts this action to [Authorize(Roles = "Admin")], so revealing
            // contact details to every caller who can reach this method is safe by construction.
            dto.ParentPhoneNumber = p.ParentPhoneNumber;
            return dto;
        }).ToList();

        return new PagedResult<TuitionPostDto>
        {
            Items = paged,
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
