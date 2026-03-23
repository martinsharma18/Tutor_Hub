namespace TuitionPlatform.Application.DTOs.Admin;

public class FeaturedTeacherRequest
{
    public Guid TeacherProfileId { get; set; }
    public DateTime ExpiresAtUtc { get; set; }
}

