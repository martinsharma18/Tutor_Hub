namespace TuitionPlatform.Application.DTOs.Auth;

public class RegisterTeacherRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string Qualification { get; set; } = string.Empty;

    public string? University { get; set; }

    public string? GraduationYear { get; set; }

    public string? Gender { get; set; }

    public string? NationalId { get; set; }

    public string ExperienceSummary { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public string Subjects { get; set; } = string.Empty;

    public string Classes { get; set; } = string.Empty;

    public string PreferredMode { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public decimal? HourlyRate { get; set; }

    public string? CvUrl { get; set; }
}

