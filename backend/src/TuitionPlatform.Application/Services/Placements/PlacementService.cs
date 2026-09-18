using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.Common.Security;
using TuitionPlatform.Application.DTOs.Placements;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Placements;

public class PlacementService : IPlacementService
{
    private readonly IPlacementRepository _placementRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly ITeacherApplicationRepository _applicationRepository;
    private readonly IAdminSettingsRepository _adminSettingsRepository;
    private readonly INotificationService _notificationService;
    private readonly IAuditLogService _auditLogService;
    private readonly IUnitOfWork _unitOfWork;

    public PlacementService(
        IPlacementRepository placementRepository,
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        ITeacherApplicationRepository applicationRepository,
        IAdminSettingsRepository adminSettingsRepository,
        INotificationService notificationService,
        IAuditLogService auditLogService,
        IUnitOfWork unitOfWork)
    {
        _placementRepository = placementRepository;
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _applicationRepository = applicationRepository;
        _adminSettingsRepository = adminSettingsRepository;
        _notificationService = notificationService;
        _auditLogService = auditLogService;
        _unitOfWork = unitOfWork;
    }

    public async Task<PlacementDto> CreateAsync(Guid adminUserId, CreatePlacementRequest request, CancellationToken cancellationToken = default)
    {
        var parentUserId = request.ParentUserId;
        var teacherProfileId = request.TeacherProfileId;
        var subject = request.Subject;
        var classLevel = request.ClassLevel;
        var tuitionPostId = request.TuitionPostId;

        // Creating from an application is the common path — pull the parties and subject from it
        // so the admin isn't retyping details that already exist.
        if (request.TeacherApplicationId.HasValue)
        {
            var application = await _applicationRepository.GetDetailedByIdAsync(request.TeacherApplicationId.Value, cancellationToken)
                              ?? throw new NotFoundException("Teacher application", request.TeacherApplicationId.Value);

            teacherProfileId = application.TeacherProfileId;
            parentUserId = application.TuitionPost.CreatedByUserId;
            tuitionPostId = application.TuitionPostId;
            if (string.IsNullOrWhiteSpace(subject)) subject = application.TuitionPost.Subject;
            if (string.IsNullOrWhiteSpace(classLevel)) classLevel = application.TuitionPost.ClassLevel;
        }

        var parent = await _userRepository.GetByIdAsync(parentUserId, cancellationToken)
                     ?? throw new NotFoundException("Parent user", parentUserId);
        var teacherProfile = await _teacherProfileRepository.GetByIdAsync(teacherProfileId, cancellationToken)
                             ?? throw new NotFoundException("Teacher profile", teacherProfileId);

        if (request.MonthlyFee <= 0)
        {
            throw new BadRequestException("Monthly fee must be greater than zero.");
        }

        var commission = request.CommissionAmount ?? await CalculateDefaultCommissionAsync(request.MonthlyFee, cancellationToken);

        if (commission < 0 || commission > request.MonthlyFee)
        {
            throw new BadRequestException("Commission must be between zero and the monthly fee.");
        }

        var placement = new Placement
        {
            ParentUserId = parentUserId,
            TeacherProfileId = teacherProfileId,
            TuitionPostId = tuitionPostId,
            Subject = subject,
            ClassLevel = classLevel,
            Mode = Enum.TryParse<TeachingMode>(request.Mode, true, out var mode) ? mode : TeachingMode.Offline,
            Schedule = request.Schedule,
            MeetingLink = request.MeetingLink,
            MonthlyFee = request.MonthlyFee,
            // Snapshotted, not recomputed later: changing the global rate must never silently
            // rewrite the terms of an arrangement both sides already agreed to.
            CommissionAmount = commission,
            TeacherPayoutAmount = request.MonthlyFee - commission,
            StartDate = request.StartDate,
            Status = PlacementStatus.Active
        };

        await _placementRepository.AddAsync(placement, cancellationToken);

        // The vacancy is now filled — take it off the open list.
        if (tuitionPostId.HasValue)
        {
            var post = await _tuitionPostRepository.GetByIdAsync(tuitionPostId.Value, cancellationToken);
            if (post is not null)
            {
                post.Status = TuitionPostStatus.Closed;
                _tuitionPostRepository.Update(post);
            }
        }

        await _auditLogService.LogAsync(adminUserId, "PlacementCreated", nameof(Placement), placement.Id,
            $"Fee={request.MonthlyFee}, Commission={commission}, Teacher={teacherProfileId}", cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.NotifyAsync(parent.Id, "PlacementStarted", "Your tuition is confirmed",
            $"{subject} classes are set up. You can see the schedule and invoices in My Tuitions.",
            "/parent/tuitions", cancellationToken);

        await _notificationService.NotifyAsync(teacherProfile.UserId, "PlacementStarted", "New assignment confirmed",
            $"You've been assigned {subject} classes. Check your schedule and earnings.",
            "/teacher/assignments", cancellationToken);

        return MapToDto(placement, parent, teacherProfile, includeFeeBreakdown: true);
    }

    public async Task<PlacementDto> UpdateAsync(Guid adminUserId, Guid placementId, UpdatePlacementRequest request, CancellationToken cancellationToken = default)
    {
        var placement = await _placementRepository.GetDetailedByIdAsync(placementId, cancellationToken)
                        ?? throw new NotFoundException("Placement", placementId);

        if (request.Schedule is not null) placement.Schedule = request.Schedule;
        if (request.MeetingLink is not null) placement.MeetingLink = request.MeetingLink;

        if (request.MonthlyFee.HasValue || request.CommissionAmount.HasValue)
        {
            var fee = request.MonthlyFee ?? placement.MonthlyFee;
            var commission = request.CommissionAmount ?? placement.CommissionAmount;

            if (fee <= 0) throw new BadRequestException("Monthly fee must be greater than zero.");
            if (commission < 0 || commission > fee) throw new BadRequestException("Commission must be between zero and the monthly fee.");

            placement.MonthlyFee = fee;
            placement.CommissionAmount = commission;
            placement.TeacherPayoutAmount = fee - commission;
        }

        _placementRepository.Update(placement);
        await _auditLogService.LogAsync(adminUserId, "PlacementUpdated", nameof(Placement), placement.Id, null, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(placement, placement.ParentUser, placement.TeacherProfile, includeFeeBreakdown: true);
    }

    public Task<PlacementDto> PauseAsync(Guid adminUserId, Guid placementId, CancellationToken cancellationToken = default)
        => ChangeStatusAsync(adminUserId, placementId, PlacementStatus.Paused, "PlacementPaused", cancellationToken);

    public Task<PlacementDto> ResumeAsync(Guid adminUserId, Guid placementId, CancellationToken cancellationToken = default)
        => ChangeStatusAsync(adminUserId, placementId, PlacementStatus.Active, "PlacementResumed", cancellationToken);

    public async Task<PlacementDto> EndAsync(Guid adminUserId, Guid placementId, EndPlacementRequest request, CancellationToken cancellationToken = default)
    {
        var placement = await _placementRepository.GetDetailedByIdAsync(placementId, cancellationToken)
                        ?? throw new NotFoundException("Placement", placementId);

        if (!Enum.TryParse<PlacementEndReason>(request.EndReason, true, out var reason))
        {
            throw new BadRequestException("Invalid end reason.");
        }

        placement.Status = PlacementStatus.Ended;
        placement.EndReason = reason;
        placement.EndNotes = request.EndNotes;
        placement.EndDate = DateOnly.FromDateTime(DateTime.UtcNow);

        _placementRepository.Update(placement);
        await _auditLogService.LogAsync(adminUserId, "PlacementEnded", nameof(Placement), placement.Id,
            $"{reason}: {request.EndNotes}", cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(placement, placement.ParentUser, placement.TeacherProfile, includeFeeBreakdown: true);
    }

    public async Task<PagedResult<PlacementDto>> GetPagedAsync(string? status, PagedRequest request, CancellationToken cancellationToken = default)
    {
        PlacementStatus? parsed = Enum.TryParse<PlacementStatus>(status, true, out var s) ? s : null;
        var (items, total) = await _placementRepository.GetPagedAsync(parsed, request.Page, request.PageSize, cancellationToken);

        return new PagedResult<PlacementDto>
        {
            // Admin always sees the full money breakdown.
            Items = items.Select(p => MapToDto(p, p.ParentUser, p.TeacherProfile, includeFeeBreakdown: true)).ToList(),
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<PlacementDto> GetByIdAsync(Guid requesterUserId, Guid placementId, CancellationToken cancellationToken = default)
    {
        var placement = await _placementRepository.GetDetailedByIdAsync(placementId, cancellationToken)
                        ?? throw new NotFoundException("Placement", placementId);

        var requester = await _userRepository.GetByIdAsync(requesterUserId, cancellationToken)
                        ?? throw new NotFoundException("User", requesterUserId);

        var isAdmin = requester.Role == UserRole.Admin;
        var isParent = placement.ParentUserId == requesterUserId;
        var isTeacher = placement.TeacherProfile.UserId == requesterUserId;

        if (!isAdmin && !isParent && !isTeacher)
        {
            throw new ForbiddenException("You are not part of this placement.");
        }

        // Teacher on an online placement sees payout only — see PlacementVisibility.
        var includeFeeBreakdown = isAdmin || isParent || PlacementVisibility.CanTeacherSeeFullFee(placement);
        return MapToDto(placement, placement.ParentUser, placement.TeacherProfile, includeFeeBreakdown);
    }

    public async Task<IReadOnlyCollection<PlacementDto>> GetMyPlacementsAsParentAsync(Guid parentUserId, CancellationToken cancellationToken = default)
    {
        var placements = await _placementRepository.GetForParentAsync(parentUserId, cancellationToken);
        return placements.Select(p => MapToDto(p, p.ParentUser, p.TeacherProfile, includeFeeBreakdown: true)).ToList();
    }

    public async Task<IReadOnlyCollection<PlacementDto>> GetMyPlacementsAsTeacherAsync(Guid teacherUserId, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByUserIdAsync(teacherUserId, cancellationToken)
                      ?? throw new NotFoundException("Teacher profile", teacherUserId);

        var placements = await _placementRepository.GetForTeacherAsync(profile.Id, cancellationToken);
        return placements
            .Select(p => MapToDto(p, p.ParentUser, p.TeacherProfile, PlacementVisibility.CanTeacherSeeFullFee(p)))
            .ToList();
    }

    private async Task<PlacementDto> ChangeStatusAsync(Guid adminUserId, Guid placementId, PlacementStatus status, string action, CancellationToken cancellationToken)
    {
        var placement = await _placementRepository.GetDetailedByIdAsync(placementId, cancellationToken)
                        ?? throw new NotFoundException("Placement", placementId);

        if (placement.Status == PlacementStatus.Ended)
        {
            throw new BadRequestException("This placement has already ended.");
        }

        placement.Status = status;
        _placementRepository.Update(placement);
        await _auditLogService.LogAsync(adminUserId, action, nameof(Placement), placement.Id, null, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return MapToDto(placement, placement.ParentUser, placement.TeacherProfile, includeFeeBreakdown: true);
    }

    private async Task<decimal> CalculateDefaultCommissionAsync(decimal monthlyFee, CancellationToken cancellationToken)
    {
        // Commission policy is intentionally not hardcoded — it comes from AdminSettings so it can
        // be changed from the admin panel without a deploy. Flat amount wins over percentage when
        // both are configured, matching the existing PaymentService behaviour.
        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);
        var commission = settings.FlatCommissionAmount ?? (monthlyFee * settings.CommissionPercentage / 100m);
        return Math.Round(Math.Min(commission, monthlyFee), 2);
    }

    private static PlacementDto MapToDto(Placement placement, User parent, TeacherProfile teacherProfile, bool includeFeeBreakdown) => new()
    {
        Id = placement.Id,
        ParentUserId = placement.ParentUserId,
        ParentName = parent?.FullName ?? "Unknown",
        TeacherProfileId = placement.TeacherProfileId,
        TeacherUserId = teacherProfile.UserId,
        TeacherName = teacherProfile.User?.FullName ?? "Unknown",
        TuitionPostId = placement.TuitionPostId,
        Subject = placement.Subject,
        ClassLevel = placement.ClassLevel,
        Mode = placement.Mode.ToString(),
        Schedule = placement.Schedule,
        MeetingLink = placement.MeetingLink,
        MonthlyFee = includeFeeBreakdown ? placement.MonthlyFee : null,
        CommissionAmount = includeFeeBreakdown ? placement.CommissionAmount : null,
        TeacherPayoutAmount = placement.TeacherPayoutAmount,
        StartDate = placement.StartDate,
        EndDate = placement.EndDate,
        Status = placement.Status.ToString(),
        EndReason = placement.EndReason?.ToString(),
        EndNotes = placement.EndNotes,
        CreatedAtUtc = placement.CreatedAtUtc
    };
}
