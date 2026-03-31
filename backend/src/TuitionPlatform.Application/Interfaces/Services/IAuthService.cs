using TuitionPlatform.Application.DTOs.Auth;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterTeacherAsync(RegisterTeacherRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);

    Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default);
}

