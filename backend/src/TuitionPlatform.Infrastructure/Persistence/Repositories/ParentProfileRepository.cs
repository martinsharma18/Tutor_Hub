using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class ParentProfileRepository : GenericRepository<ParentProfile>, IParentProfileRepository
{
    public ParentProfileRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public Task<ParentProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => DbContext.ParentProfiles.Include(p => p.User).FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);
}

