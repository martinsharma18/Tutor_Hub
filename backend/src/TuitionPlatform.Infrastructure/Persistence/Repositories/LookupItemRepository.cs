using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class LookupItemRepository : GenericRepository<LookupItem>, ILookupItemRepository
{
    public LookupItemRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<LookupItem>> GetByCategoryAsync(string category, bool includeInactive, CancellationToken cancellationToken = default)
    {
        var query = DbContext.LookupItems.Where(l => l.Category == category);
        if (!includeInactive)
        {
            query = query.Where(l => l.IsActive);
        }

        return await query.OrderBy(l => l.SortOrder).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<LookupItem>> GetAllActiveAsync(CancellationToken cancellationToken = default)
        => await DbContext.LookupItems
            .Where(l => l.IsActive)
            .OrderBy(l => l.Category).ThenBy(l => l.SortOrder)
            .ToListAsync(cancellationToken);

    public Task<bool> CodeExistsAsync(string category, string code, Guid? excludingId, CancellationToken cancellationToken = default)
    {
        var query = DbContext.LookupItems.Where(l => l.Category == category && l.Code == code);
        if (excludingId.HasValue)
        {
            query = query.Where(l => l.Id != excludingId.Value);
        }

        return query.AnyAsync(cancellationToken);
    }
}
