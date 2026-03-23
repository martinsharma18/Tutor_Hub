namespace TuitionPlatform.Application.DTOs.Teachers;

public class TeacherApplicationDto
{
    public Guid Id { get; set; }
    public Guid TeacherProfileId { get; set; }
    public Guid TeacherUserId { get; set; }
    public Guid TuitionPostId { get; set; }
    public Guid PostOwnerId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public string TeacherCity { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public string PostSubject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public DateTime? ShortlistedAtUtc { get; set; }
    public DateTime? HiredAtUtc { get; set; }
}

