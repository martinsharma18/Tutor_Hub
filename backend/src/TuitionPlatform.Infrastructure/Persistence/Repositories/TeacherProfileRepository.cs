using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class TeacherProfileRepository : GenericRepository<TeacherProfile>, ITeacherProfileRepository
{
    public TeacherProfileRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public Task<TeacherProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => DbContext.TeacherProfiles.Include(t => t.User).FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

    public async Task<IReadOnlyCollection<TeacherProfile>> SearchAsync(
        string? city,
        string? area,
        double? latitude,
        double? longitude,
        double? radiusKm,
        string? subject,
        string? classLevel,
        string? mode,
        int? minYears,
        CancellationToken cancellationToken = default)
    {
        var query = DbContext.TeacherProfiles
            .Include(t => t.User)
            .Where(t => t.IsApproved);

        if (!string.IsNullOrWhiteSpace(city))
        {
            query = query.Where(t => t.City == city);
        }

        if (!string.IsNullOrWhiteSpace(area))
        {
            query = query.Where(t => t.Area == area);
        }

        if (!string.IsNullOrWhiteSpace(subject))
        {
            query = query.Where(t => t.Subjects.Contains(subject));
        }

        if (!string.IsNullOrWhiteSpace(classLevel))
        {
            query = query.Where(t => t.Classes.Contains(classLevel));
        }

        if (!string.IsNullOrWhiteSpace(mode))
        {
            var normalizedMode = mode.ToLowerInvariant();
            query = query.Where(t => t.PreferredMode.ToString().ToLower() == normalizedMode);
        }

        if (minYears.HasValue)
        {
            query = query.Where(t => t.YearsOfExperience >= minYears.Value);
        }

        if (latitude.HasValue && longitude.HasValue && radiusKm.HasValue)
        {
            var delta = radiusKm.Value / 111.0; // approx degrees to kilometers
            var minLat = latitude.Value - delta;
            var maxLat = latitude.Value + delta;
            var minLon = longitude.Value - delta;
            var maxLon = longitude.Value + delta;
            query = query.Where(t => t.Latitude >= minLat && t.Latitude <= maxLat && t.Longitude >= minLon && t.Longitude <= maxLon);
        }

        return await query.ToListAsync(cancellationToken);
    }
}

