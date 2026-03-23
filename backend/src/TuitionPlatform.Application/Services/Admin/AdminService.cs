using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Admin;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Admin;

public class AdminService : IAdminService
{
    private readonly IUserRepository _userRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IAdminSettingsRepository _adminSettingsRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AdminService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        IPaymentRepository paymentRepository,
        IAdminSettingsRepository adminSettingsRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _paymentRepository = paymentRepository;
        _adminSettingsRepository = adminSettingsRepository;
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
            TotalParents = users.Count(u => u.Role == UserRole.Parent),
            TotalTeachers = users.Count(u => u.Role == UserRole.Teacher),
            PendingPosts = posts.Count(p => p.Status == TuitionPostStatus.Pending),
            ApprovedPosts = posts.Count(p => p.Status == TuitionPostStatus.Approved),
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
            AutoApproveTeachers = settings.AutoApproveTeachers,
            AutoApproveParentPosts = settings.AutoApproveParentPosts
        };
    }

    public async Task<CommissionSettingsRequest> UpdateSettingsAsync(CommissionSettingsRequest request, CancellationToken cancellationToken = default)
    {
        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);
        settings.CommissionPercentage = request.CommissionPercentage;
        settings.FlatCommissionAmount = request.FlatCommissionAmount;
        settings.PaymentInstructions = request.PaymentInstructions;
        settings.AutoApproveTeachers = request.AutoApproveTeachers;
        settings.AutoApproveParentPosts = request.AutoApproveParentPosts;

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
}

