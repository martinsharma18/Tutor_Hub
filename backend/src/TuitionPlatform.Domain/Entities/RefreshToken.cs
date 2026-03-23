using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }

    public string Token { get; set; } = default!;

    public DateTime ExpiresAtUtc { get; set; }

    public bool IsRevoked { get; set; }

    public User User { get; set; } = default!;
}

