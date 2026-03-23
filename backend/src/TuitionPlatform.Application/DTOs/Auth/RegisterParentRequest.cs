namespace TuitionPlatform.Application.DTOs.Auth;

public class RegisterParentRequest
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string City { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }
}

