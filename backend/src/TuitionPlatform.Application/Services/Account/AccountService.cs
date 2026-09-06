using System.Security.Cryptography;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Account;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Account;

public class AccountService : IAccountService
{
    private readonly IUserRepository _userRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly IParentProfileRepository _parentProfileRepository;
    private readonly ITuitionPostRepository _tuitionPostRepository;
    private readonly ITeacherApplicationRepository _applicationRepository;
    private readonly IDemoRequestRepository _demoRequestRepository;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IReviewRepository _reviewRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IAuditLogService _auditLogService;
    private readonly IUnitOfWork _unitOfWork;

    public AccountService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        IParentProfileRepository parentProfileRepository,
        ITuitionPostRepository tuitionPostRepository,
        ITeacherApplicationRepository applicationRepository,
        IDemoRequestRepository demoRequestRepository,
        IPaymentRepository paymentRepository,
        IMessageRepository messageRepository,
        IReviewRepository reviewRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IAuditLogService auditLogService,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _parentProfileRepository = parentProfileRepository;
        _tuitionPostRepository = tuitionPostRepository;
        _applicationRepository = applicationRepository;
        _demoRequestRepository = demoRequestRepository;
        _paymentRepository = paymentRepository;
        _messageRepository = messageRepository;
        _reviewRepository = reviewRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _auditLogService = auditLogService;
        _unitOfWork = unitOfWork;
    }

    public async Task<AccountExportDto> ExportMyDataAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new NotFoundException("User", userId);

        var export = new AccountExportDto
        {
            User = new AccountExportUser
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role.ToString(),
                EmailVerified = user.EmailVerified,
                CreatedAtUtc = user.CreatedAtUtc
            }
        };

        var teacherProfile = await _teacherProfileRepository.GetByUserIdAsync(userId, cancellationToken);
        if (teacherProfile is not null)
        {
            export.TeacherProfile = new
            {
                teacherProfile.Bio,
                teacherProfile.Qualification,
                teacherProfile.University,
                teacherProfile.GraduationYear,
                teacherProfile.Gender,
                teacherProfile.ExperienceSummary,
                teacherProfile.YearsOfExperience,
                teacherProfile.Subjects,
                teacherProfile.Classes,
                PreferredMode = teacherProfile.PreferredMode.ToString(),
                teacherProfile.City,
                teacherProfile.Area,
                teacherProfile.HourlyRate,
                teacherProfile.IsApproved,
                teacherProfile.CvUrl,
                teacherProfile.PhotoUrl
                // NationalId deliberately omitted — re-emitting a national ID number over the wire
                // creates more exposure risk than the export is worth.
            };

            var applications = await _applicationRepository.GetByTeacherIdAsync(teacherProfile.Id, cancellationToken);
            export.Applications = applications.Select(a => (object)new
            {
                a.Id,
                a.TuitionPostId,
                a.Message,
                Status = a.Status.ToString(),
                a.CreatedAtUtc
            }).ToList();

            var teacherDemos = await _demoRequestRepository.GetTeacherRequestsAsync(teacherProfile.Id, cancellationToken);
            export.DemoRequests = teacherDemos.Select(d => (object)new
            {
                d.Id, d.SelectedDate, d.SelectedTime, Status = d.Status.ToString(), d.Notes
            }).ToList();
        }

        var parentProfile = await _parentProfileRepository.GetByUserIdAsync(userId, cancellationToken);
        if (parentProfile is not null)
        {
            export.ParentProfile = new { parentProfile.City, parentProfile.Area };

            var parentDemos = await _demoRequestRepository.GetParentRequestsAsync(userId, cancellationToken);
            export.DemoRequests = parentDemos.Select(d => (object)new
            {
                d.Id, d.SelectedDate, d.SelectedTime, Status = d.Status.ToString(), d.Notes
            }).ToList();
        }

        var posts = await _tuitionPostRepository.ListAsync(p => p.CreatedByUserId == userId, cancellationToken);
        export.TuitionPosts = posts.Select(p => (object)new
        {
            p.Id, p.Subject, p.ClassLevel, p.City, p.Area, Mode = p.Mode.ToString(),
            p.Budget, p.Schedule, p.Description, Status = p.Status.ToString(), p.CreatedAtUtc
        }).ToList();

        var payments = user.Role == UserRole.Teacher
            ? await _paymentRepository.GetTeacherPaymentsAsync(userId, cancellationToken)
            : await _paymentRepository.GetParentPaymentsAsync(userId, cancellationToken);
        export.Payments = payments.Select(p => (object)new
        {
            p.Id, p.Amount, p.CommissionAmount, p.TeacherNetAmount,
            Status = p.Status.ToString(), p.ReferenceNumber, p.CreatedAtUtc
        }).ToList();

        var messages = await _messageRepository.ListAsync(m => m.SenderId == userId || m.ReceiverId == userId, cancellationToken);
        export.Messages = messages.Select(m => (object)new
        {
            m.Id, m.Body, m.SentAtUtc, Direction = m.SenderId == userId ? "sent" : "received"
        }).ToList();

        var reviews = await _reviewRepository.ListAsync(r => r.ReviewerUserId == userId, cancellationToken);
        export.Reviews = reviews.Select(r => (object)new { r.Id, r.Rating, r.Comment, r.CreatedAtUtc }).ToList();

        return export;
    }

    public async Task DeleteMyAccountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new NotFoundException("User", userId);

        if (user.Role == UserRole.Admin)
        {
            // Prevents the same lockout hole guarded against in AdminService.UpdateUserRoleAsync.
            throw new ForbiddenException("Admin accounts cannot be self-deleted. Contact another administrator.");
        }

        // Email must stay unique and must not collide with a future real signup.
        user.Email = $"deleted-{user.Id:N}@deleted.invalid";
        user.FullName = "Deleted User";
        user.PhoneNumber = null;
        // Replaces the hash with random bytes so no password can ever authenticate this row again.
        user.PasswordHash = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        user.IsActive = false;
        user.EmailVerified = false;
        user.IsDeleted = true;
        _userRepository.Update(user);

        var teacherProfile = await _teacherProfileRepository.GetByUserIdAsync(userId, cancellationToken);
        if (teacherProfile is not null)
        {
            teacherProfile.Bio = string.Empty;
            teacherProfile.ExperienceSummary = string.Empty;
            teacherProfile.University = null;
            teacherProfile.GraduationYear = null;
            teacherProfile.Gender = null;
            teacherProfile.NationalId = null;
            teacherProfile.CvUrl = null;
            teacherProfile.PhotoUrl = null;
            teacherProfile.Latitude = null;
            teacherProfile.Longitude = null;
            // Removes them from search results and any featured placement.
            teacherProfile.IsApproved = false;
            teacherProfile.IsFeatured = false;
            teacherProfile.IsDeleted = true;
            _teacherProfileRepository.Update(teacherProfile);
        }

        var parentProfile = await _parentProfileRepository.GetByUserIdAsync(userId, cancellationToken);
        if (parentProfile is not null)
        {
            parentProfile.Latitude = null;
            parentProfile.Longitude = null;
            parentProfile.IsDeleted = true;
            _parentProfileRepository.Update(parentProfile);
        }

        // Their phone number is embedded on posts they created — scrub it and close them.
        var posts = await _tuitionPostRepository.ListAsync(p => p.CreatedByUserId == userId, cancellationToken);
        foreach (var post in posts)
        {
            post.ParentPhoneNumber = string.Empty;
            post.Status = TuitionPostStatus.Closed;
            _tuitionPostRepository.Update(post);
        }

        // Any still-valid session must stop working immediately.
        var tokens = await _refreshTokenRepository.ListAsync(t => t.UserId == userId && !t.IsRevoked, cancellationToken);
        foreach (var token in tokens)
        {
            token.IsRevoked = true;
            _refreshTokenRepository.Update(token);
        }

        await _auditLogService.LogAsync(userId, "AccountSelfDeleted", nameof(Domain.Entities.User), userId,
            "User requested account deletion; personal data anonymized.", cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
