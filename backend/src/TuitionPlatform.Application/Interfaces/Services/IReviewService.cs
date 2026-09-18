using TuitionPlatform.Application.DTOs.Reviews;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IReviewService
{
    Task<ReviewDto> CreateAsync(Guid reviewerUserId, CreateReviewRequest request, CancellationToken cancellationToken = default);

    Task<TeacherRatingSummaryDto> GetForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);
}
