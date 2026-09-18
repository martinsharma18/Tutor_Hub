namespace TuitionPlatform.Application.DTOs.Reviews;

public class ReviewDto
{
    public Guid Id { get; set; }
    public Guid ReviewerUserId { get; set; }
    public string ReviewerName { get; set; } = string.Empty;
    public Guid TeacherProfileId { get; set; }
    public Guid TuitionPostId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class TeacherRatingSummaryDto
{
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public IReadOnlyCollection<ReviewDto> Reviews { get; set; } = Array.Empty<ReviewDto>();
}
