using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface ILookupItemRepository : IGenericRepository<LookupItem>
{
    Task<IReadOnlyCollection<LookupItem>> GetByCategoryAsync(string category, bool includeInactive, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<LookupItem>> GetAllActiveAsync(CancellationToken cancellationToken = default);

    Task<bool> CodeExistsAsync(string category, string code, Guid? excludingId, CancellationToken cancellationToken = default);
}
