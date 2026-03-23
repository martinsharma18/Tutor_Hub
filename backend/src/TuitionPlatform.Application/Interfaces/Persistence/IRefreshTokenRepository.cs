using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
{
    Task<RefreshToken?> GetValidTokenAsync(Guid userId, string token, CancellationToken cancellationToken = default);
}

