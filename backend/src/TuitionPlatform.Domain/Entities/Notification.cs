using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

public class Notification : AuditableEntity
{
    public Guid UserId { get; set; }

    // Machine-readable event key (e.g. "ApplicationReceived", "Hired") — lets the frontend
    // route/icon by type without parsing Title.
    public string Type { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;

    public string? LinkUrl { get; set; }

    public bool IsRead { get; set; }
}
