using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
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
    private readonly IAdminSettingsRepository _adminSettingsRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ApplicationWorkflowService(
        IUserRepository userRepository,
        ITuitionPostRepository tuitionPostRepository,
        ITeacherApplicationRepository applicationRepository,
        IAdminSettingsRepository adminSettingsRepository,
        IPaymentRepository paymentRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _applicationRepository = applicationRepository;
        _adminSettingsRepository = adminSettingsRepository;
        _paymentRepository = paymentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
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
        return applications.Select(_mapper.Map<TeacherApplicationDto>).ToList();
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

        return _mapper.Map<TeacherApplicationDto>(application);
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

        var teacherUserId = application.TeacherProfile?.UserId
                            ?? throw new ValidationException(new Dictionary<string, string[]>
                            {
                                ["teacher"] = new[] { "Teacher profile is missing user information." }
                            });

        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);
        var commissionAmount = settings.FlatCommissionAmount ?? (request.AgreedAmount.Value * settings.CommissionPercentage / 100m);
        var parentOwnerId = post.CreatedByUserId;

        var payment = new Payment
        {
            ParentId = parentOwnerId,
            TeacherId = teacherUserId,
            TuitionPostId = post.Id,
            Amount = request.AgreedAmount.Value,
            CommissionAmount = commissionAmount,
            TeacherNetAmount = request.AgreedAmount.Value - commissionAmount,
            Status = PaymentStatus.Pending
        };

        await _paymentRepository.AddAsync(payment, cancellationToken);
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


