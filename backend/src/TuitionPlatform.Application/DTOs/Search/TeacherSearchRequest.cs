using TuitionPlatform.Application.Common.Models;

namespace TuitionPlatform.Application.DTOs.Search;

public class TeacherSearchRequest : PagedRequest
{
    public string? City { get; set; }

    public string? Area { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public double? RadiusKm { get; set; }

    public string? Subject { get; set; }

    public string? ClassLevel { get; set; }

    public string? Mode { get; set; }

    public int? MinExperience { get; set; }
}

