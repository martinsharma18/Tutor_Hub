namespace TuitionPlatform.Application.DTOs.Teachers;

public class TeacherProfileDto
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Qualification { get; set; } = string.Empty;

    public string ExperienceSummary { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public string Subjects { get; set; } = string.Empty;

    public string Classes { get; set; } = string.Empty;

    public string PreferredMode { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public bool IsApproved { get; set; }

    public bool IsFeatured { get; set; }

    public decimal? HourlyRate { get; set; }
}

