using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface ITokenService
{
    (string AccessToken, DateTime ExpiresAtUtc) CreateAccessToken(User user);

    Task<string> CreateRefreshTokenAsync(User user, CancellationToken cancellationToken = default);

    Task<RefreshToken?> ValidateRefreshTokenAsync(User user, string refreshToken, CancellationToken cancellationToken = default);
}

