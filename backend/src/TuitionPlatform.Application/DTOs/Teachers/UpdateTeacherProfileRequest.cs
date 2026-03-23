namespace TuitionPlatform.Application.DTOs.Teachers;

public class UpdateTeacherProfileRequest
{
    public string? Bio { get; set; }

    public string? Qualification { get; set; }

    public string? ExperienceSummary { get; set; }

    public int? YearsOfExperience { get; set; }

    public string? Subjects { get; set; }

    public string? Classes { get; set; }

    public string? PreferredMode { get; set; }

    public string? City { get; set; }

    public string? Area { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public decimal? HourlyRate { get; set; }
}

