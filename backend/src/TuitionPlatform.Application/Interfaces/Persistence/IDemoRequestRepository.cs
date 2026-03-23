using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IDemoRequestRepository : IGenericRepository<DemoRequest>
{
    Task<IReadOnlyCollection<DemoRequest>> GetTeacherRequestsAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<DemoRequest>> GetParentRequestsAsync(Guid parentProfileId, CancellationToken cancellationToken = default);
}

