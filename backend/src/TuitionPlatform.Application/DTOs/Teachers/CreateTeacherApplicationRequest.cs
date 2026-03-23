namespace TuitionPlatform.Application.DTOs.Teachers;

public class CreateTeacherApplicationRequest
{
    public Guid TuitionPostId { get; set; }
    public string Message { get; set; } = string.Empty;
}

