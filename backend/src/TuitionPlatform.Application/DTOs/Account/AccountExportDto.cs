namespace TuitionPlatform.Application.DTOs.Account;

/// <summary>
/// Everything the platform holds about one user, in a portable shape. Returned by the
/// data-export endpoint that the Privacy Policy commits to.
/// </summary>
public class AccountExportDto
{
    public DateTime ExportedAtUtc { get; set; } = DateTime.UtcNow;

    public AccountExportUser User { get; set; } = new();
    public object? TeacherProfile { get; set; }
    public object? ParentProfile { get; set; }
    public IReadOnlyCollection<object> TuitionPosts { get; set; } = Array.Empty<object>();
    public IReadOnlyCollection<object> Applications { get; set; } = Array.Empty<object>();
    public IReadOnlyCollection<object> DemoRequests { get; set; } = Array.Empty<object>();
    public IReadOnlyCollection<object> Payments { get; set; } = Array.Empty<object>();
    public IReadOnlyCollection<object> Messages { get; set; } = Array.Empty<object>();
    public IReadOnlyCollection<object> Reviews { get; set; } = Array.Empty<object>();
}

public class AccountExportUser
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool EmailVerified { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
