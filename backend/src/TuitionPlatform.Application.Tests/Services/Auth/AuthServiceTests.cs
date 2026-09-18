using AutoMapper;
using Microsoft.Extensions.Configuration;
using Moq;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Auth;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Application.Mapping;
using TuitionPlatform.Application.Services.Auth;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;
using Xunit;

namespace TuitionPlatform.Application.Tests.Services.Auth;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<ITeacherProfileRepository> _teacherProfileRepository = new();
    private readonly Mock<IParentProfileRepository> _parentProfileRepository = new();
    private readonly Mock<IAdminSettingsRepository> _adminSettingsRepository = new();
    private readonly Mock<IVerificationTokenRepository> _verificationTokenRepository = new();
    private readonly Mock<ITokenService> _tokenService = new();
    private readonly Mock<IPasswordHasher> _passwordHasher = new();
    private readonly Mock<IEmailSender> _emailSender = new();
    private readonly Mock<IConfiguration> _configuration = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly IMapper _mapper;

    public AuthServiceTests()
    {
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddProfile<ApplicationProfile>());
        _mapper = mapperConfig.CreateMapper();

        _tokenService
            .Setup(t => t.CreateAccessToken(It.IsAny<User>()))
            .Returns(("access-token", DateTime.UtcNow.AddHours(1)));
        _tokenService
            .Setup(t => t.CreateRefreshTokenAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("refresh-token");
    }

    private AuthService CreateSut() => new(
        _userRepository.Object,
        _teacherProfileRepository.Object,
        _parentProfileRepository.Object,
        _adminSettingsRepository.Object,
        _verificationTokenRepository.Object,
        _tokenService.Object,
        _passwordHasher.Object,
        _emailSender.Object,
        _configuration.Object,
        _unitOfWork.Object,
        _mapper);

    // Locks in the login-enumeration fix: an unknown email and a wrong password for a known email
    // must be indistinguishable to the caller (same exception type, same message).
    [Fact]
    public async Task LoginAsync_UnknownEmail_ThrowsSameErrorAsWrongPassword()
    {
        _userRepository.Setup(r => r.GetByEmailAsync("ghost@example.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var sut = CreateSut();
        var ex = await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.LoginAsync(new LoginRequest { Email = "ghost@example.com", Password = "whatever" }));

        Assert.Equal("Invalid credentials.", ex.Message);
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ThrowsSameErrorAsUnknownEmail()
    {
        var existingUser = new User { Id = Guid.NewGuid(), Email = "real@example.com", PasswordHash = "hashed", IsActive = true };
        _userRepository.Setup(r => r.GetByEmailAsync("real@example.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingUser);
        _passwordHasher.Setup(h => h.Verify("wrong", "hashed")).Returns(false);

        var sut = CreateSut();
        var ex = await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.LoginAsync(new LoginRequest { Email = "real@example.com", Password = "wrong" }));

        Assert.Equal("Invalid credentials.", ex.Message);
    }

    [Fact]
    public async Task LoginAsync_InactiveAccount_ThrowsForbidden()
    {
        var user = new User { Id = Guid.NewGuid(), Email = "inactive@example.com", PasswordHash = "hashed", IsActive = false };
        _userRepository.Setup(r => r.GetByEmailAsync("inactive@example.com", It.IsAny<CancellationToken>())).ReturnsAsync(user);
        _passwordHasher.Setup(h => h.Verify("correct", "hashed")).Returns(true);

        var sut = CreateSut();
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.LoginAsync(new LoginRequest { Email = "inactive@example.com", Password = "correct" }));
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponseWithTokens()
    {
        var user = new User { Id = Guid.NewGuid(), Email = "valid@example.com", FullName = "Valid User", PasswordHash = "hashed", IsActive = true, Role = UserRole.Teacher };
        _userRepository.Setup(r => r.GetByEmailAsync("valid@example.com", It.IsAny<CancellationToken>())).ReturnsAsync(user);
        _passwordHasher.Setup(h => h.Verify("correct", "hashed")).Returns(true);

        var sut = CreateSut();
        var result = await sut.LoginAsync(new LoginRequest { Email = "valid@example.com", Password = "correct" });

        Assert.Equal("access-token", result.AccessToken);
        Assert.Equal("refresh-token", result.RefreshToken);
        Assert.Equal(user.Id, result.User.Id);
    }

    [Fact]
    public async Task RegisterTeacherAsync_DuplicateEmail_ThrowsValidationException()
    {
        _userRepository.Setup(r => r.GetByEmailAsync("taken@example.com", It.IsAny<CancellationToken>()))
            .ReturnsAsync(new User { Email = "taken@example.com" });

        var sut = CreateSut();
        await Assert.ThrowsAsync<TuitionPlatform.Application.Common.Exceptions.ValidationException>(
            () => sut.RegisterTeacherAsync(new RegisterTeacherRequest { Email = "taken@example.com", Password = "password123", FullName = "Someone" }));
    }

    // AutoApproveTeachers was editable in the admin settings UI but silently ignored by
    // registration (hardcoded IsApproved = false). This locks in that it's actually read now.
    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task RegisterTeacherAsync_UsesAutoApproveTeachersSetting(bool autoApprove)
    {
        _userRepository.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync((User?)null);
        _adminSettingsRepository.Setup(r => r.GetSettingsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new AdminSettings { AutoApproveTeachers = autoApprove });

        TeacherProfile? capturedProfile = null;
        _teacherProfileRepository
            .Setup(r => r.AddAsync(It.IsAny<TeacherProfile>(), It.IsAny<CancellationToken>()))
            .Callback<TeacherProfile, CancellationToken>((profile, _) => capturedProfile = profile)
            .Returns(Task.CompletedTask);

        var sut = CreateSut();
        await sut.RegisterTeacherAsync(new RegisterTeacherRequest
        {
            Email = "new-teacher@example.com",
            Password = "password123",
            FullName = "New Teacher",
            Subjects = "Math",
            Classes = "10",
            PreferredMode = "Online"
        });

        Assert.NotNull(capturedProfile);
        Assert.Equal(autoApprove, capturedProfile!.IsApproved);
    }

    [Fact]
    public async Task RegisterParentAsync_CreatesUserWithParentRole()
    {
        _userRepository.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync((User?)null);

        User? capturedUser = null;
        _userRepository
            .Setup(r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()))
            .Callback<User, CancellationToken>((user, _) => capturedUser = user)
            .Returns(Task.CompletedTask);

        var sut = CreateSut();
        await sut.RegisterParentAsync(new RegisterParentRequest
        {
            Email = "parent@example.com",
            Password = "password123",
            FullName = "A Parent",
            City = "Kathmandu",
            Area = "Baneshwor"
        });

        Assert.NotNull(capturedUser);
        Assert.Equal(UserRole.Parent, capturedUser!.Role);
    }
}
