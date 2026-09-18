using TuitionPlatform.Application.DTOs.Auth;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterTeacherAsync(RegisterTeacherRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> RegisterParentAsync(RegisterParentRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default);

    /// <summary>Always succeeds from the caller's point of view — never reveals whether the email is registered.</summary>
    Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default);

    Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default);

    Task RequestEmailVerificationAsync(Guid userId, CancellationToken cancellationToken = default);

    Task ConfirmEmailAsync(ConfirmEmailRequest request, CancellationToken cancellationToken = default);
}

