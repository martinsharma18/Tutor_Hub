using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

/// <summary>
/// Immutable record of an admin/sensitive action — who did what, to which entity, and when.
/// Never updated or soft-deleted once written (no AuditableEntity base) — an editable audit log
/// isn't an audit log.
/// </summary>
public class AuditLog : BaseEntity
{
    public Guid ActorUserId { get; set; }

    public string Action { get; set; } = string.Empty;

    public string EntityType { get; set; } = string.Empty;

    public Guid EntityId { get; set; }

    public string? Details { get; set; }
}
