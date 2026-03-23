using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

public class TeacherProfile : AuditableEntity
{
    public Guid UserId { get; set; }

    public string Bio { get; set; } = string.Empty;

    public string Qualification { get; set; } = string.Empty;

    public string ExperienceSummary { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public string Subjects { get; set; } = string.Empty;

    public string Classes { get; set; } = string.Empty;

    public TeachingMode PreferredMode { get; set; }

    public string City { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public bool IsApproved { get; set; }

    public bool IsFeatured { get; set; }

    public decimal? HourlyRate { get; set; }

    public User User { get; set; } = default!;

    public ICollection<TeacherApplication> Applications { get; set; } = new List<TeacherApplication>();

    public ICollection<DemoRequest> DemoRequests { get; set; } = new List<DemoRequest>();
}

