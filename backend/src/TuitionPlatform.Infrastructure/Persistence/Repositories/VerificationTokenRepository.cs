using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class VerificationTokenRepository : GenericRepository<VerificationToken>, IVerificationTokenRepository
{
    public VerificationTokenRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public Task<VerificationToken?> GetValidTokenAsync(string token, VerificationTokenPurpose purpose, CancellationToken cancellationToken = default)
        => DbContext.VerificationTokens.FirstOrDefaultAsync(
            t => t.Token == token && t.Purpose == purpose && t.UsedAtUtc == null && t.ExpiresAtUtc > DateTime.UtcNow,
            cancellationToken);
}
