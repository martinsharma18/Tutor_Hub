namespace TuitionPlatform.Application.DTOs.Messages;

public class MessageDto
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public string Body { get; set; } = string.Empty;
    public DateTime SentAtUtc { get; set; }
    public bool IsRead { get; set; }
}

