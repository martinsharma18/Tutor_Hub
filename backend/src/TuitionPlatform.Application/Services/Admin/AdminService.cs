using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.Admin;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Enums;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Services.Admin;

public class AdminService : IAdminService
{
    private readonly IUserRepository _userRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IAdminSettingsRepository _adminSettingsRepository;
    private readonly ITeacherApplicationRepository _teacherApplicationRepository;
    private readonly IPlacementRepository _placementRepository;
    private readonly INotificationService _notificationService;
    private readonly IAuditLogService _auditLogService;
    private readonly IAuditLogRepository _auditLogRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AdminService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        IPaymentRepository paymentRepository,
        IAdminSettingsRepository adminSettingsRepository,
        ITeacherApplicationRepository teacherApplicationRepository,
        IPlacementRepository placementRepository,
        INotificationService notificationService,
        IAuditLogService auditLogService,
        IAuditLogRepository auditLogRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _paymentRepository = paymentRepository;
        _adminSettingsRepository = adminSettingsRepository;
        _teacherApplicationRepository = teacherApplicationRepository;
        _placementRepository = placementRepository;
        _notificationService = notificationService;
        _auditLogService = auditLogService;
        _auditLogRepository = auditLogRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AdminDashboardSummary> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        // Was four full-table loads (Users, TuitionPosts, Payments, TeacherProfiles) just to
        // produce seven numbers. Every count/sum below now runs as its own SQL aggregate.
        return new AdminDashboardSummary
        {
            TotalUsers = await _userRepository.CountAsync(null, cancellationToken),
            TotalTeachers = await _userRepository.CountAsync(u => u.Role == UserRole.Teacher, cancellationToken),
            PendingTeachers = await _teacherProfileRepository.CountAsync(t => !t.IsApproved, cancellationToken),
            AvailableVacancies = await _tuitionPostRepository.CountAsync(
                p => p.Status == TuitionPostStatus.Approved || p.Status == TuitionPostStatus.Open, cancellationToken),
            ClosedVacancies = await _tuitionPostRepository.CountAsync(p => p.Status == TuitionPostStatus.Closed, cancellationToken),
            TotalCommissionEarned = await _paymentRepository.GetTotalPaidCommissionAsync(cancellationToken),
            PendingPayments = await _paymentRepository.CountAsync(p => p.Status == PaymentStatus.Pending, cancellationToken)
        };
    }

    public async Task<CommissionSettingsRequest> GetSettingsAsync(CancellationToken cancellationToken = default)
    {
        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);
        return new CommissionSettingsRequest
        {
            CommissionPercentage = settings.CommissionPercentage,
            FlatCommissionAmount = settings.FlatCommissionAmount,
            PaymentInstructions = settings.PaymentInstructions,
            AutoApproveTeachers = settings.AutoApproveTeachers
        };
    }

    public async Task<CommissionSettingsRequest> UpdateSettingsAsync(Guid actorUserId, CommissionSettingsRequest request, CancellationToken cancellationToken = default)
    {
        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);
        settings.CommissionPercentage = request.CommissionPercentage;
        settings.FlatCommissionAmount = request.FlatCommissionAmount;
        settings.PaymentInstructions = request.PaymentInstructions;
        settings.AutoApproveTeachers = request.AutoApproveTeachers;

        _adminSettingsRepository.Update(settings);

        await _auditLogService.LogAsync(actorUserId, "CommissionSettingsUpdated", nameof(Domain.Entities.AdminSettings), settings.Id,
            $"Commission%={request.CommissionPercentage}, Flat={request.FlatCommissionAmount}, AutoApprove={request.AutoApproveTeachers}", cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return request;
    }

    public async Task<TeacherProfileDto> ApproveTeacherAsync(Guid actorUserId, Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByIdAsync(teacherProfileId, cancellationToken)
                       ?? throw new NotFoundException("Teacher profile", teacherProfileId);

        profile.IsApproved = true;
        _teacherProfileRepository.Update(profile);

        await _auditLogService.LogAsync(actorUserId, "TeacherApproved", nameof(Domain.Entities.TeacherProfile), profile.Id, null, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _notificationService.NotifyAsync(
            profile.UserId,
            "TeacherApproved",
            "Your profile is approved!",
            "You can now apply to tuition vacancies.",
            "/teacher",
            cancellationToken);

        return _mapper.Map<TeacherProfileDto>(profile);
    }

    public async Task<TeacherProfileDto> FeatureTeacherAsync(Guid actorUserId, FeaturedTeacherRequest request, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByIdAsync(request.TeacherProfileId, cancellationToken)
                       ?? throw new NotFoundException("Teacher profile", request.TeacherProfileId);

        profile.IsFeatured = true;
        _teacherProfileRepository.Update(profile);

        await _auditLogService.LogAsync(actorUserId, "TeacherFeatured", nameof(Domain.Entities.TeacherProfile), profile.Id, null, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TeacherProfileDto>(profile);
    }

    public async Task<AdminTeacherDetailsDto> GetTeacherDetailsAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByIdAsync(teacherProfileId, cancellationToken)
                       ?? throw new NotFoundException("Teacher profile", teacherProfileId);

        var applications = await _teacherApplicationRepository.GetByTeacherIdAsync(teacherProfileId, cancellationToken);
        
        return new AdminTeacherDetailsDto
        {
            Profile = _mapper.Map<TeacherProfileDto>(profile),
            Applications = applications.Select(_mapper.Map<TeacherApplicationDto>).ToList()
        };
    }

    public async Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.ListAsync(null, cancellationToken);
        var teacherProfiles = await _teacherProfileRepository.ListAsync(null, cancellationToken);
        var profileMap = teacherProfiles.ToDictionary(tp => tp.UserId);

        return users.Select(u => {
            profileMap.TryGetValue(u.Id, out var tp);
            return new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                FullName = u.FullName,
                Role = u.Role.ToString(),
                IsActive = u.IsActive,
                CreatedAtUtc = u.CreatedAtUtc,
                TeacherProfileId = tp?.Id,
                IsTeacherApproved = tp?.IsApproved
            };
        }).ToList();
    }

    public async Task<List<TeacherProfileDto>> GetAllTeachersAsync(CancellationToken cancellationToken = default)
    {
        var teachers = await _teacherProfileRepository.GetAllWithUsersAsync(cancellationToken);
        return teachers.Select(_mapper.Map<TeacherProfileDto>).ToList();
    }

    public async Task<UserDto> UpdateUserStatusAsync(Guid actorUserId, Guid userId, bool isActive, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                    ?? throw new NotFoundException("User", userId);

        if (!isActive && userId == actorUserId)
        {
            throw new ForbiddenException("You cannot deactivate your own account.");
        }

        user.IsActive = isActive;
        _userRepository.Update(user);

        await _auditLogService.LogAsync(actorUserId, isActive ? "UserActivated" : "UserDeactivated", nameof(Domain.Entities.User), user.Id, null, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc
        };
    }

    public async Task<UserDto> UpdateUserRoleAsync(Guid actorUserId, Guid userId, string role, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                    ?? throw new NotFoundException("User", userId);

        if (!Enum.TryParse<UserRole>(role, true, out var userRole))
        {
            throw new BadRequestException("Invalid role.");
        }

        // Previously unguarded: an admin could demote themselves, or demote the last remaining
        // admin, permanently locking every admin screen behind an account that can't reach it.
        if (user.Role == UserRole.Admin && userRole != UserRole.Admin)
        {
            if (userId == actorUserId)
            {
                throw new ForbiddenException("You cannot change your own admin role.");
            }

            var adminCount = await _userRepository.CountAsync(u => u.Role == UserRole.Admin, cancellationToken);
            if (adminCount <= 1)
            {
                throw new ForbiddenException("Cannot remove the last remaining admin.");
            }
        }

        var previousRole = user.Role;
        user.Role = userRole;
        _userRepository.Update(user);

        await _auditLogService.LogAsync(actorUserId, "UserRoleChanged", nameof(Domain.Entities.User), user.Id, $"{previousRole} -> {userRole}", cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString(),
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc
        };
    }

    public async Task<List<TeacherApplicationDto>> GetAllApplicationsAsync(CancellationToken cancellationToken = default)
    {
        var applications = await _teacherApplicationRepository.ListAllDetailedAsync(cancellationToken);
        var placedPostIds = (await _placementRepository.ListPlacedTuitionPostIdsAsync(cancellationToken)).ToHashSet();

        return applications.Select(a =>
        {
            var dto = _mapper.Map<TeacherApplicationDto>(a);
            dto.HasPlacement = placedPostIds.Contains(a.TuitionPostId);
            return dto;
        }).ToList();
    }

    public async Task RemoveTeacherAsync(Guid actorUserId, Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByIdAsync(teacherProfileId, cancellationToken)
                       ?? throw new NotFoundException("Teacher profile", teacherProfileId);

        _teacherProfileRepository.Remove(profile);

        await _auditLogService.LogAsync(actorUserId, "TeacherProfileRemoved", nameof(Domain.Entities.TeacherProfile), teacherProfileId, null, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<PagedResult<AuditLogDto>> GetAuditLogAsync(PagedRequest request, CancellationToken cancellationToken = default)
    {
        var (items, total) = await _auditLogRepository.ListPagedAsync(null, request.Page, request.PageSize, cancellationToken);

        var actorIds = items.Select(a => a.ActorUserId).Distinct().ToList();
        var actors = new Dictionary<Guid, string>();
        foreach (var actorId in actorIds)
        {
            var actor = await _userRepository.GetByIdAsync(actorId, cancellationToken);
            if (actor is not null)
            {
                actors[actorId] = actor.FullName;
            }
        }

        var dtos = items.Select(a => new AuditLogDto
        {
            Id = a.Id,
            ActorUserId = a.ActorUserId,
            ActorName = actors.TryGetValue(a.ActorUserId, out var name) ? name : "Unknown",
            Action = a.Action,
            EntityType = a.EntityType,
            EntityId = a.EntityId,
            Details = a.Details,
            CreatedAtUtc = a.CreatedAtUtc
        }).ToList();

        return new PagedResult<AuditLogDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }
}
