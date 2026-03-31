using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.DTOs.Admin;

public class AdminTeacherDetailsDto
{
    public TeacherProfileDto Profile { get; set; } = default!;
    public List<TeacherApplicationDto> Applications { get; set; } = new();
}
