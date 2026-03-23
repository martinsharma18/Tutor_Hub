using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IParentProfileRepository : IGenericRepository<ParentProfile>
{
    Task<ParentProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
}

