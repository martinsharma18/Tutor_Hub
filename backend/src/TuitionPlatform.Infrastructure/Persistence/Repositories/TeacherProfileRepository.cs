using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class TeacherProfileRepository : GenericRepository<TeacherProfile>, ITeacherProfileRepository
{
    public TeacherProfileRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    // TeacherProfileDto maps FullName from User.FullName, so a profile loaded without its User
    // produces a DTO with a null name — which crashed the admin teacher-details page. Every
    // caller of this method maps to that DTO, so the Include belongs here rather than at each site.
    public override Task<TeacherProfile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => DbContext.TeacherProfiles.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

    public Task<TeacherProfile?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => DbContext.TeacherProfiles.Include(t => t.User).FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);

    public async Task<TeacherSearchQueryResult> SearchAsync(
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

        var isGeoSearch = latitude.HasValue && longitude.HasValue && radiusKm.HasValue;

        if (isGeoSearch)
        {
            // A degree-based bounding box is a SQUARE, not a circle — it's a cheap, index-friendly
            // SQL pre-filter only. Exact distance is computed below and out-of-radius rows dropped.
            var delta = radiusKm!.Value / 111.0; // approx degrees per km
            var minLat = latitude!.Value - delta;
            var maxLat = latitude.Value + delta;
            var minLon = longitude!.Value - delta;
            var maxLon = longitude.Value + delta;
            query = query.Where(t => t.Latitude >= minLat && t.Latitude <= maxLat && t.Longitude >= minLon && t.Longitude <= maxLon);

            // Geo search needs the exact (non-square) distance computed and sorted in memory, so
            // true SQL-level Skip/Take isn't possible here without a PostGIS-style distance
            // function — that's the next-level fix once this can be verified against a live DB.
            var candidates = await query.ToListAsync(cancellationToken);

            var withDistance = candidates
                .Select(t => (Teacher: t, DistanceKm: HaversineKm(latitude.Value, longitude.Value, t.Latitude!.Value, t.Longitude!.Value)))
                .Where(x => x.DistanceKm <= radiusKm.Value)
                .OrderBy(x => x.DistanceKm)
                .ToList();

            var pagedGeo = withDistance
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new TeacherSearchResult(x.Teacher, x.DistanceKm))
                .ToList();

            return new TeacherSearchQueryResult(pagedGeo, withDistance.Count);
        }

        // Non-geo search: relevance-ranked (featured, then experience) with real SQL-level
        // pagination — this is the common "browse by subject/city" path. Rating isn't a column on
        // TeacherProfile (see Review/IReviewRepository), so it can't join into this ORDER BY
        // without a schema change; ranking by rating is a follow-up once that's denormalized.
        query = query
            .OrderByDescending(t => t.IsFeatured)
            .ThenByDescending(t => t.YearsOfExperience);

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TeacherSearchResult(t, null))
            .ToListAsync(cancellationToken);

        return new TeacherSearchQueryResult(items, total);
    }

    // Standard great-circle distance formula. Kept as plain C# (not a SQL-translated expression)
    // since there is no live database in this environment to verify a trig-function translation
    // against — running it here, over the already-narrow bounding-box result set, is correct and
    // low-risk even though it isn't push-to-SQL for the geo-search path.
    private static double HaversineKm(double lat1, double lon1, double lat2, double lon2)
    {
        const double earthRadiusKm = 6371.0;
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return earthRadiusKm * c;
    }

    private static double ToRadians(double degrees) => degrees * Math.PI / 180.0;

    public async Task<IReadOnlyCollection<TeacherProfile>> GetAllWithUsersAsync(CancellationToken cancellationToken = default)
        => await DbContext.TeacherProfiles.Include(t => t.User).ToListAsync(cancellationToken);
}

