using AutoMapper;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Auth;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;
using TuitionPlatform.Application.Common.Security;

namespace TuitionPlatform.Application.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly IParentProfileRepository _parentProfileRepository;
    private readonly IAdminSettingsRepository _adminSettingsRepository;
    private readonly IVerificationTokenRepository _verificationTokenRepository;
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEmailSender _emailSender;
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        IParentProfileRepository parentProfileRepository,
        IAdminSettingsRepository adminSettingsRepository,
        IVerificationTokenRepository verificationTokenRepository,
        ITokenService tokenService,
        IPasswordHasher passwordHasher,
        IEmailSender emailSender,
        IConfiguration configuration,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _parentProfileRepository = parentProfileRepository;
        _adminSettingsRepository = adminSettingsRepository;
        _verificationTokenRepository = verificationTokenRepository;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
        _emailSender = emailSender;
        _configuration = configuration;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AuthResponse> RegisterTeacherAsync(RegisterTeacherRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureEmailIsUnique(request.Email, cancellationToken);

        var user = new User
        {
            Email = request.Email.ToLowerInvariant(),
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            Role = UserRole.Teacher,
            PasswordHash = _passwordHasher.Hash(request.Password),
            IsActive = true,
            EmailVerified = false
        };

        await _userRepository.AddAsync(user, cancellationToken);

        // AutoApproveTeachers was editable in the admin settings UI but never read anywhere,
        // so the toggle silently did nothing and every teacher required manual approval.
        var settings = await _adminSettingsRepository.GetSettingsAsync(cancellationToken);

        var profile = new TeacherProfile
        {
            User = user,
            Bio = request.Bio,
            Qualification = request.Qualification,
            University = request.University,
            GraduationYear = request.GraduationYear,
            Gender = request.Gender,
            NationalId = request.NationalId,
            ExperienceSummary = request.ExperienceSummary,
            YearsOfExperience = request.YearsOfExperience,
            Subjects = request.Subjects,
            Classes = request.Classes,
            PreferredMode = Enum.TryParse<TeachingMode>(request.PreferredMode, true, out var mode) ? mode : TeachingMode.Online,
            City = request.City,
            Area = request.Area,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            HourlyRate = request.HourlyRate,
            CvUrl = request.CvUrl,
            IsApproved = settings.AutoApproveTeachers
        };

        await _teacherProfileRepository.AddAsync(profile, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> RegisterParentAsync(RegisterParentRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureEmailIsUnique(request.Email, cancellationToken);

        var user = new User
        {
            Email = request.Email.ToLowerInvariant(),
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            Role = UserRole.Parent,
            PasswordHash = _passwordHasher.Hash(request.Password),
            IsActive = true,
            EmailVerified = false
        };

        await _userRepository.AddAsync(user, cancellationToken);

        var profile = new ParentProfile
        {
            User = user,
            City = request.City,
            Area = request.Area,
            Latitude = request.Latitude,
            Longitude = request.Longitude
        };

        await _parentProfileRepository.AddAsync(profile, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);

        // Unknown email and wrong password return the identical error. Previously these were
        // distinguishable (NotFoundException vs ForbiddenException), letting an attacker enumerate
        // which emails are registered by reading the response.
        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new ForbiddenException("Invalid credentials.");
        }

        if (!user.IsActive)
        {
            throw new ForbiddenException("Account is inactive. Please contact support.");
        }

        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var principal = JwtTokenHelper.GetPrincipalFromExpiredToken(request.AccessToken);
        var userIdClaim = principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim is null || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new ForbiddenException("Invalid access token.");
        }

        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new NotFoundException("User", userId);

        var refreshToken = await _tokenService.ValidateRefreshTokenAsync(user, request.RefreshToken, cancellationToken)
                            ?? throw new ForbiddenException("Invalid refresh token.");

        var (AccessToken, ExpiresAtUtc) = _tokenService.CreateAccessToken(user);
        var newRefreshToken = await _tokenService.CreateRefreshTokenAsync(user, cancellationToken);

        return new AuthResponse
        {
            AccessToken = AccessToken,
            ExpiresAtUtc = ExpiresAtUtc,
            RefreshToken = newRefreshToken,
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken);

        // Silently no-op for an unknown email — mirrors the LoginAsync fix: the caller must not
        // be able to tell registered emails from unregistered ones via response behavior.
        if (user is null)
        {
            return;
        }

        var token = await CreateVerificationTokenAsync(user.Id, VerificationTokenPurpose.PasswordReset, TimeSpan.FromHours(1), cancellationToken);
        var link = $"{FrontendBaseUrl}/reset-password?token={Uri.EscapeDataString(token)}";

        await _emailSender.SendAsync(
            user.Email,
            "Reset your password",
            $"Click the link below to reset your password (valid for 1 hour):\n{link}\n\nIf you didn't request this, ignore this email.",
            cancellationToken);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var token = await _verificationTokenRepository.GetValidTokenAsync(request.Token, VerificationTokenPurpose.PasswordReset, cancellationToken)
                    ?? throw new BadRequestException("This reset link is invalid or has expired.");

        var user = await _userRepository.GetByIdAsync(token.UserId, cancellationToken)
                   ?? throw new NotFoundException("User", token.UserId);

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        token.UsedAtUtc = DateTime.UtcNow;

        _userRepository.Update(user);
        _verificationTokenRepository.Update(token);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task RequestEmailVerificationAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new NotFoundException("User", userId);

        if (user.EmailVerified)
        {
            return;
        }

        var token = await CreateVerificationTokenAsync(user.Id, VerificationTokenPurpose.EmailVerification, TimeSpan.FromDays(2), cancellationToken);
        var link = $"{FrontendBaseUrl}/verify-email?token={Uri.EscapeDataString(token)}";

        await _emailSender.SendAsync(
            user.Email,
            "Verify your email",
            $"Click the link below to verify your email (valid for 2 days):\n{link}",
            cancellationToken);
    }

    public async Task ConfirmEmailAsync(ConfirmEmailRequest request, CancellationToken cancellationToken = default)
    {
        var token = await _verificationTokenRepository.GetValidTokenAsync(request.Token, VerificationTokenPurpose.EmailVerification, cancellationToken)
                    ?? throw new BadRequestException("This verification link is invalid or has expired.");

        var user = await _userRepository.GetByIdAsync(token.UserId, cancellationToken)
                   ?? throw new NotFoundException("User", token.UserId);

        user.EmailVerified = true;
        token.UsedAtUtc = DateTime.UtcNow;

        _userRepository.Update(user);
        _verificationTokenRepository.Update(token);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private string FrontendBaseUrl => _configuration["Frontend:BaseUrl"]?.TrimEnd('/') ?? "http://localhost:5173";

    private async Task<string> CreateVerificationTokenAsync(Guid userId, VerificationTokenPurpose purpose, TimeSpan validFor, CancellationToken cancellationToken)
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');

        await _verificationTokenRepository.AddAsync(new VerificationToken
        {
            UserId = userId,
            Token = token,
            Purpose = purpose,
            ExpiresAtUtc = DateTime.UtcNow.Add(validFor)
        }, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return token;
    }

    private async Task EnsureEmailIsUnique(string email, CancellationToken cancellationToken)
    {
        var existing = await _userRepository.GetByEmailAsync(email.ToLowerInvariant(), cancellationToken);
        if (existing is not null)
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["email"] = new[] { "Email is already registered." }
            });
        }
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(User user, CancellationToken cancellationToken)
    {
        var (accessToken, expiresAt) = _tokenService.CreateAccessToken(user);
        var refreshToken = await _tokenService.CreateRefreshTokenAsync(user, cancellationToken);

        return new AuthResponse
        {
            AccessToken = accessToken,
            ExpiresAtUtc = expiresAt,
            RefreshToken = refreshToken,
            User = _mapper.Map<UserDto>(user)
        };
    }
}
