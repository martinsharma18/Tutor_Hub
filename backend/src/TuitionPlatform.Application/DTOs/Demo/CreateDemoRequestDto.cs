namespace TuitionPlatform.Application.DTOs.Demo;

public class CreateDemoRequestDto
{
    public Guid TeacherProfileId { get; set; }

    public Guid TuitionPostId { get; set; }

    public DateOnly SelectedDate { get; set; }

    public TimeOnly SelectedTime { get; set; }

    public string? Notes { get; set; }
}

