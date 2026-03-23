using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class TuitionPostRepository : GenericRepository<TuitionPost>, ITuitionPostRepository
{
    public TuitionPostRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public override Task<TuitionPost?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => DbContext.TuitionPosts.Include(p => p.ParentProfile).FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task<PagedTuitionPostResult> SearchAsync(
        TuitionPostStatus? status,
        string? city,
        string? subject,
        string? classLevel,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = DbContext.TuitionPosts.AsQueryable();

        if (status.HasValue)
        {
            var targetStatus = status.Value;
            query = query.Where(p => p.Status == targetStatus);
        }

        if (!string.IsNullOrWhiteSpace(city))
        {
            query = query.Where(p => p.City == city);
        }

        if (!string.IsNullOrWhiteSpace(subject))
        {
            query = query.Where(p => p.Subject.Contains(subject));
        }

        if (!string.IsNullOrWhiteSpace(classLevel))
        {
            query = query.Where(p => p.ClassLevel.Contains(classLevel));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(p => p.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedTuitionPostResult(items, total);
    }
}

