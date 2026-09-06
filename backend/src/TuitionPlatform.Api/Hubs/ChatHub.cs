using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TuitionPlatform.Api.Extensions;

namespace TuitionPlatform.Api.Hubs;

/// <summary>
/// Carries no chat logic itself — sending/persisting still goes through MessageService via the
/// normal REST endpoint. This hub only maintains a per-user group so the server can push
/// "new message" / "new notification" events to every connection that user has open.
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.GetUserId();
        if (userId is not null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(userId.Value));
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.GetUserId();
        if (userId is not null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupName(userId.Value));
        }

        await base.OnDisconnectedAsync(exception);
    }

    public static string GroupName(Guid userId) => $"user:{userId}";
}
