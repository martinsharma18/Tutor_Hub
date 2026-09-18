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
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly IDemoRequestRepository _demoRequestRepository;
    private readonly INotificationService _notificationService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DemoService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        IDemoRequestRepository demoRequestRepository,
        INotificationService notificationService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _demoRequestRepository = demoRequestRepository;
        _notificationService = notificationService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<DemoRequestDto> CreateAsync(Guid parentUserId, CreateDemoRequestDto request, CancellationToken cancellationToken = default)
    {
        // Was previously hardcoded to throw NotSupportedException — left over from before the
        // Parent role existed on this system. The repository method it needs already existed.
        var post = await _tuitionPostRepository.GetByIdAsync(request.TuitionPostId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", request.TuitionPostId);

        if (post.CreatedByUserId != parentUserId)
        {
            throw new ForbiddenException("You can only request a demo for your own vacancy.");
        }

        var teacherProfile = await _teacherProfileRepository.GetByIdAsync(request.TeacherProfileId, cancellationToken)
                              ?? throw new NotFoundException("Teacher profile", request.TeacherProfileId);

        var demo = new Domain.Entities.DemoRequest
        {
            ParentId = parentUserId,
            TeacherProfileId = request.TeacherProfileId,
            TuitionPostId = request.TuitionPostId,
            SelectedDate = request.SelectedDate,
            SelectedTime = request.SelectedTime,
            Notes = request.Notes,
            Status = DemoStatus.Pending
        };

        await _demoRequestRepository.AddAsync(demo, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.NotifyAsync(
            teacherProfile.UserId,
            "DemoRequested",
            "New demo request",
            $"A demo was requested for \"{post.Subject}\" on {demo.SelectedDate:MMM dd} at {demo.SelectedTime}.",
            "/teacher/demo",
            cancellationToken);

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
        else if (user.Role == UserRole.Admin)
        {
            // Admins can update status
        }
        else
        {
            throw new ForbiddenException("Only admins or teachers can update demo requests.");
        }

        demo.Status = status;
        demo.Notes = request.Notes;
        _demoRequestRepository.Update(demo);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Notify whichever side didn't make this update — a teacher accepting/declining notifies
        // the parent, and a parent cancelling notifies the teacher.
        var notifyUserId = user.Role == UserRole.Teacher
            ? demo.ParentId
            : (await _teacherProfileRepository.GetByIdAsync(demo.TeacherProfileId, cancellationToken))?.UserId;

        if (notifyUserId.HasValue)
        {
            await _notificationService.NotifyAsync(
                notifyUserId.Value,
                "DemoStatusUpdated",
                "Demo request updated",
                $"Your demo request is now \"{status}\".",
                user.Role == UserRole.Teacher ? "/parent/demo" : "/teacher/demo",
                cancellationToken);
        }

        return _mapper.Map<DemoRequestDto>(demo);
    }

    public async Task<IReadOnlyCollection<DemoRequestDto>> GetParentRequestsAsync(Guid parentUserId, CancellationToken cancellationToken = default)
    {
        // Was previously hardcoded to always return empty — the repository method it needs
        // already existed (GetParentRequestsAsync), it just wasn't being called.
        var demos = await _demoRequestRepository.GetParentRequestsAsync(parentUserId, cancellationToken);
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
