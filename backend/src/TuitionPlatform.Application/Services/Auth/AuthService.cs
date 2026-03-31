using AutoMapper;
using System.Security.Claims;
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
    private readonly ITokenService _tokenService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository userRepository,
        ITeacherProfileRepository teacherProfileRepository,
        ITokenService tokenService,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
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
            IsApproved = false
        };

        await _teacherProfileRepository.AddAsync(profile, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email.ToLowerInvariant(), cancellationToken)
                   ?? throw new NotFoundException("User", request.Email);

        if (!user.IsActive)
        {
            throw new ForbiddenException("Account is inactive. Please contact support.");
        }

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new ForbiddenException("Invalid credentials.");
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
