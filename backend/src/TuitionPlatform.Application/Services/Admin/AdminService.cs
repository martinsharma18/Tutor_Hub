using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AdminService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        IPaymentRepository paymentRepository,
        IAdminSettingsRepository adminSettingsRepository,
        ITeacherApplicationRepository teacherApplicationRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _paymentRepository = paymentRepository;
        _adminSettingsRepository = adminSettingsRepository;
        _teacherApplicationRepository = teacherApplicationRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AdminDashboardSummary> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.ListAsync(null, cancellationToken);
        var posts = await _tuitionPostRepository.ListAsync(null, cancellationToken);
        var payments = await _paymentRepository.ListAsync(null, cancellationToken);

        return new AdminDashboardSummary
        {
            TotalUsers = users.Count,
            TotalTeachers = users.Count(u => u.Role == UserRole.Teacher),
            AvailableVacancies = posts.Count(p => p.Status == TuitionPostStatus.Approved || p.Status == TuitionPostStatus.Open),
            ClosedVacancies = posts.Count(p => p.Status == TuitionPostStatus.Closed),
            TotalCommissionEarned = payments.Where(p => p.Status == PaymentStatus.Paid).Sum(p => p.CommissionAmount),
            PendingPayments = payments.Count(p => p.Status == PaymentStatus.Pending)
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

    public async Task<CommissionSettingsRequest> UpdateSettingsAsync(CommissionSettingsRequest request, CancellationToken cancellationToken = default)
    {
        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);
        settings.CommissionPercentage = request.CommissionPercentage;
        settings.FlatCommissionAmount = request.FlatCommissionAmount;
        settings.PaymentInstructions = request.PaymentInstructions;
        settings.AutoApproveTeachers = request.AutoApproveTeachers;

        _adminSettingsRepository.Update(settings);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return request;
    }

    public async Task<TeacherProfileDto> ApproveTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByIdAsync(teacherProfileId, cancellationToken)
                       ?? throw new NotFoundException("Teacher profile", teacherProfileId);

        profile.IsApproved = true;
        _teacherProfileRepository.Update(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<TeacherProfileDto>(profile);
    }

    public async Task<TeacherProfileDto> FeatureTeacherAsync(FeaturedTeacherRequest request, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByIdAsync(request.TeacherProfileId, cancellationToken)
                       ?? throw new NotFoundException("Teacher profile", request.TeacherProfileId);

        profile.IsFeatured = true;
        _teacherProfileRepository.Update(profile);
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
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Email = u.Email,
            FullName = u.FullName,
            Role = u.Role.ToString(),
            IsActive = u.IsActive,
            CreatedAtUtc = u.CreatedAtUtc
        }).ToList();
    }

    public async Task<UserDto> UpdateUserStatusAsync(Guid userId, bool isActive, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                    ?? throw new NotFoundException("User", userId);

        user.IsActive = isActive;
        _userRepository.Update(user);
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

    public async Task<UserDto> UpdateUserRoleAsync(Guid userId, string role, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                    ?? throw new NotFoundException("User", userId);

        if (!Enum.TryParse<UserRole>(role, true, out var userRole))
        {
            throw new BadRequestException("Invalid role.");
        }

        user.Role = userRole;
        _userRepository.Update(user);
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
        var applications = await _teacherApplicationRepository.ListAsync(null, cancellationToken);
        return applications.Select(_mapper.Map<TeacherApplicationDto>).ToList();
    }

    public async Task RemoveTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var profile = await _teacherProfileRepository.GetByIdAsync(teacherProfileId, cancellationToken)
                       ?? throw new NotFoundException("Teacher profile", teacherProfileId);

        _teacherProfileRepository.Remove(profile);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
