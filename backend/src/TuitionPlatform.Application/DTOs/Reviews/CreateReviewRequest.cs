namespace TuitionPlatform.Application.DTOs.Reviews;

public class CreateReviewRequest
{
    public Guid TuitionPostId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }
}
