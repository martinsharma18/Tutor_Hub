namespace TuitionPlatform.Application.DTOs.Demo;

public class DemoRequestDto
{
    public Guid Id { get; set; }
    public Guid TeacherProfileId { get; set; }
    public Guid ParentId { get; set; }
    public Guid TuitionPostId { get; set; }
    public DateOnly SelectedDate { get; set; }
    public TimeOnly SelectedTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

