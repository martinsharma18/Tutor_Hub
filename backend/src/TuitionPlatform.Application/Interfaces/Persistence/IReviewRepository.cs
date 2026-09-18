using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IReviewRepository : IGenericRepository<Review>
{
    Task<IReadOnlyCollection<Review>> GetByTeacherIdAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(Guid reviewerUserId, Guid tuitionPostId, CancellationToken cancellationToken = default);

    /// <summary>Grouped average/count per teacher — avoids one query per teacher on list/search screens.</summary>
    Task<Dictionary<Guid, (double AverageRating, int ReviewCount)>> GetRatingSummariesAsync(
        IReadOnlyCollection<Guid> teacherProfileIds, CancellationToken cancellationToken = default);
}
