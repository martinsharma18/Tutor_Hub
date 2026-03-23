using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
{
    public RefreshTokenRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public Task<RefreshToken?> GetValidTokenAsync(Guid userId, string token, CancellationToken cancellationToken = default)
        => DbContext.RefreshTokens.FirstOrDefaultAsync(
            r => r.UserId == userId && r.Token == token && !r.IsRevoked && r.ExpiresAtUtc > DateTime.UtcNow,
            cancellationToken);
}

