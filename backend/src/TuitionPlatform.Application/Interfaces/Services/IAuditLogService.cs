namespace TuitionPlatform.Application.Interfaces.Services;

public interface IAuditLogService
{
    /// <summary>
    /// Stages an audit entry — does NOT call SaveChanges itself, so it commits atomically with
    /// whatever mutation the caller is already about to save. Call this immediately before (or
    /// after building) the caller's own SaveChangesAsync, never in a separate transaction.
    /// </summary>
    Task LogAsync(Guid actorUserId, string action, string entityType, Guid entityId, string? details = null, CancellationToken cancellationToken = default);
}
