using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.Common.Security;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Applications;

public class ApplicationWorkflowService : IApplicationWorkflowService
{
    private readonly IUserRepository _userRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly ITeacherApplicationRepository _applicationRepository;
    private readonly ITeacherProfileRepository _teacherRepository;
    private readonly INotificationService _notificationService;
    private readonly IAuditLogService _auditLogService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ApplicationWorkflowService(
        IUserRepository userRepository,
        ITuitionPostRepository tuitionPostRepository,
        ITeacherApplicationRepository applicationRepository,
        ITeacherProfileRepository teacherRepository,
        INotificationService notificationService,
        IAuditLogService auditLogService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _applicationRepository = applicationRepository;
        _teacherRepository = teacherRepository;
        _notificationService = notificationService;
        _auditLogService = auditLogService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IReadOnlyCollection<TeacherApplicationDto>> GetMyApplicationsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        var teacher = await _teacherRepository.GetByUserIdAsync(userId, cancellationToken)
                      ?? throw new NotFoundException("Teacher profile", userId);

        var applications = await _applicationRepository.GetByTeacherIdAsync(teacher.Id, cancellationToken);
        
        var requester = await _userRepository.GetByIdAsync(userId, cancellationToken)
                        ?? throw new NotFoundException("User", userId);

        return applications.Select(app => MapToDtoWithMasking(app, requester)).ToList();
    }

    public async Task<IReadOnlyCollection<TeacherApplicationDto>> GetApplicationsForPostAsync(
        Guid requesterId,
        Guid postId,
        CancellationToken cancellationToken = default)
    {
        var post = await _tuitionPostRepository.GetByIdAsync(postId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", postId);

        await EnsureCanManagePostAsync(requesterId, post, cancellationToken);

        var applications = await _applicationRepository.GetByPostIdAsync(postId, cancellationToken);
        var requester = await _userRepository.GetByIdAsync(requesterId, cancellationToken)
                        ?? throw new NotFoundException("User", requesterId);

        return applications.Select(app => MapToDtoWithMasking(app, requester)).ToList();
    }

    public async Task<TeacherApplicationDto> UpdateStatusAsync(
        Guid requesterId,
        Guid applicationId,
        UpdateApplicationStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        var application = await _applicationRepository.GetDetailedByIdAsync(applicationId, cancellationToken)
                          ?? throw new NotFoundException("Teacher application", applicationId);

        var post = application.TuitionPost
                   ?? await _tuitionPostRepository.GetByIdAsync(application.TuitionPostId, cancellationToken)
                   ?? throw new NotFoundException("Tuition post", application.TuitionPostId);

        var requester = await EnsureCanManagePostAsync(requesterId, post, cancellationToken);

        if (!Enum.TryParse<ApplicationStatus>(request.Status, true, out var desiredStatus))
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["status"] = new[] { "Invalid status value." }
            });
        }

        switch (desiredStatus)
        {
            case ApplicationStatus.Shortlisted:
                application.Status = ApplicationStatus.Shortlisted;
                application.ShortlistedAtUtc = DateTime.UtcNow;
                break;
            case ApplicationStatus.Rejected:
                application.Status = ApplicationStatus.Rejected;
                break;
            case ApplicationStatus.Hired:
                await HandleHireAsync(application, post, requester, request, cancellationToken);
                break;
            default:
                throw new ValidationException(new Dictionary<string, string[]>
                {
                    ["status"] = new[] { "Unsupported status transition." }
                });
        }

        _applicationRepository.Update(application);
        _tuitionPostRepository.Update(post);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var teacherUserId = application.TeacherProfile?.UserId;
        if (teacherUserId.HasValue)
        {
            var (title, body) = desiredStatus switch
            {
                ApplicationStatus.Shortlisted => ("You've been shortlisted", $"You were shortlisted for \"{post.Subject}\"."),
                ApplicationStatus.Rejected => ("Application update", $"Your application for \"{post.Subject}\" was not selected."),
                ApplicationStatus.Hired => ("You've been hired!", $"You were hired for \"{post.Subject}\". Complete the commission payment to unlock the parent's contact."),
                _ => (string.Empty, string.Empty)
            };

            if (title.Length > 0)
            {
                await _notificationService.NotifyAsync(teacherUserId.Value, $"Application{desiredStatus}", title, body, "/teacher/applications", cancellationToken);
            }
        }

        return MapToDtoWithMasking(application, requester);
    }

    private async Task HandleHireAsync(
        Domain.Entities.TeacherApplication application,
        TuitionPost post,
        User requester,
        UpdateApplicationStatusRequest request,
        CancellationToken cancellationToken)
    {
        if (!request.AgreedAmount.HasValue || request.AgreedAmount.Value <= 0)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["agreedAmount"] = new[] { "Agreed amount must be provided when hiring a teacher." }
            });
        }

        application.Status = ApplicationStatus.Hired;
        application.HiredAtUtc = DateTime.UtcNow;
        post.Status = TuitionPostStatus.Closed;

        _ = application.TeacherProfile?.UserId
            ?? throw new ValidationException(new Dictionary<string, string[]>
            {
                ["teacher"] = new[] { "Teacher profile is missing user information." }
            });

        // Previously this created a one-off Payment row as the commission gate. Under the managed
        // placement model the money lives on Placement + monthly Invoice instead, and an admin
        // sets the terms (fee, schedule, meeting link) rather than them being derived here.
        // So hiring now just flags the match as ready and hands off to the office.
        var admins = await _userRepository.ListAsync(u => u.Role == UserRole.Admin && u.IsActive, cancellationToken);
        foreach (var admin in admins)
        {
            await _notificationService.NotifyAsync(
                admin.Id,
                "PlacementNeeded",
                "New hire — set up the placement",
                $"\"{post.Subject}\" was filled at a proposed {request.AgreedAmount.Value:N2}/month. Create the placement to start billing.",
                "/admin/placements",
                cancellationToken);
        }
    }

    public async Task<TeacherApplicationDto> VerifyPaymentAsync(
        Guid requesterId,
        Guid applicationId,
        CancellationToken cancellationToken = default)
    {
        var requester = await _userRepository.GetByIdAsync(requesterId, cancellationToken)
                        ?? throw new NotFoundException("User", requesterId);

        if (requester.Role != UserRole.Admin)
        {
            throw new ForbiddenException("Only administrators can verify payments.");
        }

        var application = await _applicationRepository.GetDetailedByIdAsync(applicationId, cancellationToken)
                          ?? throw new NotFoundException("Teacher application", applicationId);

        application.IsPaymentVerified = true;

        _applicationRepository.Update(application);

        await _auditLogService.LogAsync(requesterId, "PaymentVerified", nameof(TeacherApplication), application.Id,
            "Released parent contact details to teacher.", cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDtoWithMasking(application, requester);
    }

    private TeacherApplicationDto MapToDtoWithMasking(Domain.Entities.TeacherApplication application, User requester)
    {
        var dto = _mapper.Map<TeacherApplicationDto>(application);

        // AutoMapper no longer auto-populates ParentPhoneNumber (see ApplicationProfile), so it
        // must be set explicitly here based on ContactVisibility — the single paywall gate.
        dto.ParentPhoneNumber = ContactVisibility.ForApplication(requester, application)
            ? application.TuitionPost.ParentPhoneNumber
            : "********";

        return dto;
    }

    private async Task<User> EnsureCanManagePostAsync(Guid requesterId, TuitionPost post, CancellationToken cancellationToken)
    {
        var requester = await _userRepository.GetByIdAsync(requesterId, cancellationToken)
                        ?? throw new NotFoundException("User", requesterId);

        if (requester.Role == UserRole.Admin)
        {
            return requester;
        }

        if (post.CreatedByUserId != requester.Id)
        {
            throw new ForbiddenException("You are not allowed to manage applications for this post.");
        }

        return requester;
    }
}


