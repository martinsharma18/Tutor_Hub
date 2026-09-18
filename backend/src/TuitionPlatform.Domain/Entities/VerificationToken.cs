using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

public class VerificationToken : BaseEntity
{
    public Guid UserId { get; set; }

    public string Token { get; set; } = default!;

    public VerificationTokenPurpose Purpose { get; set; }

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime? UsedAtUtc { get; set; }

    public User User { get; set; } = default!;
}
