using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface ITuitionPostRepository : IGenericRepository<TuitionPost>
{
    Task<PagedTuitionPostResult> SearchAsync(
        TuitionPostStatus? status,
        string? city,
        string? subject,
        string? classLevel,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);
}

public record PagedTuitionPostResult(IReadOnlyCollection<TuitionPost> Items, int TotalCount);

