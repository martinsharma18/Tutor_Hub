namespace TuitionPlatform.Application.DTOs.Auth;

public class AuthResponse
{
    public required string AccessToken { get; init; }

    public required string RefreshToken { get; init; }

    public required DateTime ExpiresAtUtc { get; init; }

    public required UserDto User { get; init; }
}

public class UserDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public bool EmailVerified { get; set; }
}

