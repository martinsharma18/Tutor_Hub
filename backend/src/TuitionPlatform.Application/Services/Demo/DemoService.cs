using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Demo;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Demo;

public class DemoService : IDemoService
{
    private readonly IUserRepository _userRepository;
    private readonly IParentProfileRepository _parentProfileRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly IDemoRequestRepository _demoRequestRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DemoService(
        IUserRepository userRepository,
        IParentProfileRepository parentProfileRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        IDemoRequestRepository demoRequestRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _parentProfileRepository = parentProfileRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _demoRequestRepository = demoRequestRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DemoRequestDto> CreateAsync(Guid parentUserId, CreateDemoRequestDto request, CancellationToken cancellationToken = default)
    {
        var parentUser = await _userRepository.GetByIdAsync(parentUserId, cancellationToken)
                          ?? throw new NotFoundException("User", parentUserId);
        if (parentUser.Role != UserRole.Parent)
        {
            throw new ForbiddenException("Only parents can request demo classes.");
        }

        var parentProfile = await _parentProfileRepository.GetByUserIdAsync(parentUserId, cancellationToken)
                              ?? throw new NotFoundException("Parent profile", parentUserId);

        var teacherProfile = await _teacherProfileRepository.GetByIdAsync(request.TeacherProfileId, cancellationToken)
                              ?? throw new NotFoundException("Teacher profile", request.TeacherProfileId);

        var post = await _tuitionPostRepository.GetByIdAsync(request.TuitionPostId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", request.TuitionPostId);

        var demo = new Domain.Entities.DemoRequest
        {
            ParentProfileId = parentProfile.Id,
            TeacherProfileId = teacherProfile.Id,
            TuitionPostId = post.Id,
            SelectedDate = request.SelectedDate,
            SelectedTime = request.SelectedTime,
            Notes = request.Notes,
            Status = DemoStatus.Pending
        };

        await _demoRequestRepository.AddAsync(demo, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<DemoRequestDto>(demo);
    }

    public async Task<DemoRequestDto> UpdateStatusAsync(Guid userId, Guid demoId, UpdateDemoStatusRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken) ?? throw new NotFoundException("User", userId);

        var demo = await _demoRequestRepository.GetByIdAsync(demoId, cancellationToken)
                   ?? throw new NotFoundException("Demo request", demoId);

        if (!Enum.TryParse<DemoStatus>(request.Status, true, out var status))
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["status"] = new[] { "Invalid demo status." }
            });
        }

        if (user.Role == UserRole.Teacher)
        {
            var teacherProfile = await _teacherProfileRepository.GetByUserIdAsync(userId, cancellationToken)
                                  ?? throw new NotFoundException("Teacher profile", userId);
            if (teacherProfile.Id != demo.TeacherProfileId)
            {
                throw new ForbiddenException("You cannot modify this demo request.");
            }
        }
        else if (user.Role == UserRole.Parent)
        {
            var parentProfile = await _parentProfileRepository.GetByUserIdAsync(userId, cancellationToken)
                                  ?? throw new NotFoundException("Parent profile", userId);
            if (parentProfile.Id != demo.ParentProfileId)
            {
                throw new ForbiddenException("You cannot modify this demo request.");
            }
        }
        else
        {
            throw new ForbiddenException("Only parents or teachers can update demo requests.");
        }

        demo.Status = status;
        demo.Notes = request.Notes;
        _demoRequestRepository.Update(demo);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<DemoRequestDto>(demo);
    }

    public async Task<IReadOnlyCollection<DemoRequestDto>> GetParentRequestsAsync(Guid parentUserId, CancellationToken cancellationToken = default)
    {
        var parentProfile = await _parentProfileRepository.GetByUserIdAsync(parentUserId, cancellationToken)
                              ?? throw new NotFoundException("Parent profile", parentUserId);

        var demos = await _demoRequestRepository.GetParentRequestsAsync(parentProfile.Id, cancellationToken);
        return demos.Select(_mapper.Map<DemoRequestDto>).ToList();
    }

    public async Task<IReadOnlyCollection<DemoRequestDto>> GetTeacherRequestsAsync(Guid teacherUserId, CancellationToken cancellationToken = default)
    {
        var teacherProfile = await _teacherProfileRepository.GetByUserIdAsync(teacherUserId, cancellationToken)
                                ?? throw new NotFoundException("Teacher profile", teacherUserId);

        var demos = await _demoRequestRepository.GetTeacherRequestsAsync(teacherProfile.Id, cancellationToken);
        return demos.Select(_mapper.Map<DemoRequestDto>).ToList();
    }
}

