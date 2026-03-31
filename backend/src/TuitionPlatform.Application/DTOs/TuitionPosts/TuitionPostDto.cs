namespace TuitionPlatform.Application.DTOs.TuitionPosts;

public class TuitionPostDto
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string ClassLevel { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string Mode { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public string Schedule { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

