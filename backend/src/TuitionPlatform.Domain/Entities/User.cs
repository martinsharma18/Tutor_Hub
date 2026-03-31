using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

public class User : AuditableEntity
{
    public string Email { get; set; } = default!;

    public string PasswordHash { get; set; } = default!;

    public string FullName { get; set; } = default!;

    public string? PhoneNumber { get; set; }

    public UserRole Role { get; set; }

    public bool IsActive { get; set; } = true;

    public bool EmailVerified { get; set; }

    public TeacherProfile? TeacherProfile { get; set; }
}
