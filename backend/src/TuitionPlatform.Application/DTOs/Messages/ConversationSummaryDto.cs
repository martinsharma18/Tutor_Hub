namespace TuitionPlatform.Application.DTOs.Messages;

public class ConversationSummaryDto
{
    public Guid OtherUserId { get; set; }
    public string OtherUserName { get; set; } = string.Empty;
    public string LastMessageBody { get; set; } = string.Empty;
    public DateTime LastMessageAtUtc { get; set; }
    public bool LastMessageIsUnread { get; set; }
}

/// <summary>
/// Someone the current user is actually permitted to message. Served by the API rather than
/// derived in the browser so the contact list can never disagree with the authorization rule
/// in MessageService.CanMessageAsync.
/// </summary>
public class MessageContactDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    /// <summary>Why they're reachable — e.g. "Support" or the subject of the shared tuition.</summary>
    public string Context { get; set; } = string.Empty;
}
