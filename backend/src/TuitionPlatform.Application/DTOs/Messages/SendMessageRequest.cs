namespace TuitionPlatform.Application.DTOs.Messages;

public class SendMessageRequest
{
    public Guid ReceiverId { get; set; }
    public string Body { get; set; } = string.Empty;
}

