namespace TuitionPlatform.Application.DTOs.Demo;

public class UpdateDemoStatusRequest
{
    public string Status { get; set; } = string.Empty;

    public string? Notes { get; set; }
}

