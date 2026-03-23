using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected readonly TuitionPlatformDbContext DbContext;

    protected GenericRepository(TuitionPlatformDbContext dbContext)
    {
        DbContext = dbContext;
    }

    public virtual Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => DbContext.Set<T>().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public virtual async Task<IReadOnlyCollection<T>> ListAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default)
    {
        var query = DbContext.Set<T>().AsQueryable();
        if (predicate is not null)
        {
            query = query.Where(predicate);
        }

        var items = await query.ToListAsync(cancellationToken);
        return items;
    }

    public virtual Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        return DbContext.Set<T>().AddAsync(entity, cancellationToken).AsTask();
    }

    public virtual void Update(T entity)
    {
        DbContext.Set<T>().Update(entity);
    }

    public virtual void Remove(T entity)
    {
        DbContext.Set<T>().Remove(entity);
    }
}

