using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface ITeacherProfileRepository : IGenericRepository<TeacherProfile>
{
    Task<TeacherProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TeacherProfile>> SearchAsync(
        string? city,
        string? area,
        double? latitude,
        double? longitude,
        double? radiusKm,
        string? subject,
        string? classLevel,
        string? mode,
        int? minYears,
        CancellationToken cancellationToken = default);
}

