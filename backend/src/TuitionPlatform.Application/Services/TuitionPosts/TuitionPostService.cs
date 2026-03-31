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

        if (user.Role != UserRole.Admin)
        {
            throw new ForbiddenException("Only admins can create vacancies.");
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
            Status = TuitionPostStatus.Open
        };

        await _tuitionPostRepository.AddAsync(post, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TuitionPostDto>(post);
    }

    public async Task<TuitionPostDto> ApproveAsync(Guid adminUserId, Guid postId, CancellationToken cancellationToken = default)
    {
        // deprecated as we don't have pending status anymore
        var post = await _tuitionPostRepository.GetByIdAsync(postId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", postId);

        post.Status = TuitionPostStatus.Open;
        _tuitionPostRepository.Update(post);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TuitionPostDto>(post);
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
        var posts = await _tuitionPostRepository.ListAsync(p => p.CreatedByUserId == userId, cancellationToken);
        var paged = posts
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(_mapper.Map<TuitionPostDto>)
            .ToList();

        return new PagedResult<TuitionPostDto>
        {
            Items = paged,
            TotalCount = posts.Count,
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

        return new PagedResult<TuitionPostDto>
        {
            Items = result.Items.Select(_mapper.Map<TuitionPostDto>).ToList(),
            TotalCount = result.TotalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<PagedResult<TuitionPostDto>> GetPendingPostsAsync(PagedRequest request, CancellationToken cancellationToken = default)
    {
        // Return empty since we don't have pending status anymore
        return new PagedResult<TuitionPostDto>
        {
            Items = new List<TuitionPostDto>(),
            TotalCount = 0,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<PagedResult<TuitionPostDto>> GetAllPostsAsync(PagedRequest request, CancellationToken cancellationToken = default)
    {
        var posts = await _tuitionPostRepository.ListAsync(null, cancellationToken);
        var paged = posts
            .OrderByDescending(p => p.CreatedAtUtc)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(_mapper.Map<TuitionPostDto>)
            .ToList();

        return new PagedResult<TuitionPostDto>
        {
            Items = paged,
            TotalCount = posts.Count,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
