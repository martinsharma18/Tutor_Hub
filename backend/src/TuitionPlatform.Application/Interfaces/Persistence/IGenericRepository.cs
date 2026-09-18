using System.Linq.Expressions;
using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<T>> ListAsync(
        Expression<Func<T, bool>>? predicate = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Database-level Skip/Take, newest first. Use this instead of ListAsync + in-memory
    /// Skip/Take for any endpoint that takes a page — ListAsync loads every matching row.
    /// </summary>
    Task<(IReadOnlyCollection<T> Items, int TotalCount)> ListPagedAsync(
        Expression<Func<T, bool>>? predicate,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>Database-level COUNT — use for dashboard/summary numbers instead of loading rows to .Count() them.</summary>
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null, CancellationToken cancellationToken = default);

    Task AddAsync(T entity, CancellationToken cancellationToken = default);

    void Update(T entity);

    void Remove(T entity);
}

