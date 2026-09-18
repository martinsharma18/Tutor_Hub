using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class ReviewRepository : GenericRepository<Review>, IReviewRepository
{
    public ReviewRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<Review>> GetByTeacherIdAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
        => await DbContext.Reviews
            .Include(r => r.ReviewerUser)
            .Where(r => r.TeacherProfileId == teacherProfileId)
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync(cancellationToken);

    public Task<bool> ExistsAsync(Guid reviewerUserId, Guid tuitionPostId, CancellationToken cancellationToken = default)
        => DbContext.Reviews.AnyAsync(r => r.ReviewerUserId == reviewerUserId && r.TuitionPostId == tuitionPostId, cancellationToken);

    public async Task<Dictionary<Guid, (double AverageRating, int ReviewCount)>> GetRatingSummariesAsync(
        IReadOnlyCollection<Guid> teacherProfileIds, CancellationToken cancellationToken = default)
    {
        var grouped = await DbContext.Reviews
            .Where(r => teacherProfileIds.Contains(r.TeacherProfileId))
            .GroupBy(r => r.TeacherProfileId)
            .Select(g => new { TeacherProfileId = g.Key, Average = g.Average(r => r.Rating), Count = g.Count() })
            .ToListAsync(cancellationToken);

        return grouped.ToDictionary(g => g.TeacherProfileId, g => (Math.Round(g.Average, 1), g.Count));
    }
}
