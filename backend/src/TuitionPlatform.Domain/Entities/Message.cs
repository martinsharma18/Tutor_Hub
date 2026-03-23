using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

public class Message : AuditableEntity
{
    public Guid SenderId { get; set; }

    public Guid ReceiverId { get; set; }

    public Guid ConversationKey { get; set; }

    public string Body { get; set; } = string.Empty;

    public DateTime SentAtUtc { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; }
}

