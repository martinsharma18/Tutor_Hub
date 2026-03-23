namespace TuitionPlatform.Application.DTOs.Teachers;

public class UpdateApplicationStatusRequest
{
    public string Status { get; set; } = string.Empty;

    public decimal? AgreedAmount { get; set; }

    public string? Notes { get; set; }
}
