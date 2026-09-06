using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Messages;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/messages")]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;

    public MessagesController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> Send(SendMessageRequest request, CancellationToken cancellationToken)
    {
        var result = await _messageService.SendMessageAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{otherUserId:guid}")]
    public async Task<ActionResult<IReadOnlyCollection<MessageDto>>> Conversation(Guid otherUserId, [FromQuery] int take = 50, CancellationToken cancellationToken = default)
    {
        var result = await _messageService.GetConversationAsync(User.GetUserId(), otherUserId, take, cancellationToken);
        return Ok(result);
    }

    [HttpGet("inbox")]
    public async Task<ActionResult<IReadOnlyCollection<ConversationSummaryDto>>> Inbox(CancellationToken cancellationToken)
    {
        var result = await _messageService.GetInboxAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> UnreadCount(CancellationToken cancellationToken)
    {
        var result = await _messageService.GetUnreadCountAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("contacts")]
    public async Task<ActionResult<IReadOnlyCollection<MessageContactDto>>> Contacts(CancellationToken cancellationToken)
    {
        var result = await _messageService.GetContactsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}

