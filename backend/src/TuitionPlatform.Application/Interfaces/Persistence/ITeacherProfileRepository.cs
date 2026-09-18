using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public record TeacherSearchResult(TeacherProfile Teacher, double? DistanceKm);

public record TeacherSearchQueryResult(IReadOnlyCollection<TeacherSearchResult> Items, int TotalCount);

public interface ITeacherProfileRepository : IGenericRepository<TeacherProfile>
{
    Task<TeacherProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TeacherSearchQueryResult> SearchAsync(
        string? city,
        string? area,
        double? latitude,
        double? longitude,
        double? radiusKm,
        string? subject,
        string? classLevel,
        string? mode,
        int? minYears,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TeacherProfile>> GetAllWithUsersAsync(CancellationToken cancellationToken = default);
}

