using Microsoft.AspNetCore.SignalR;
using TuitionPlatform.Application.DTOs.Messages;
using TuitionPlatform.Application.DTOs.Notifications;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Hubs;

public class SignalRRealtimeNotifier : IRealtimeNotifier
{
    private readonly IHubContext<ChatHub> _hubContext;

    public SignalRRealtimeNotifier(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task NotifyNewMessageAsync(Guid recipientUserId, MessageDto message, CancellationToken cancellationToken = default)
        => _hubContext.Clients.Group(ChatHub.GroupName(recipientUserId))
            .SendAsync("ReceiveMessage", message, cancellationToken);

    public Task NotifyNotificationAsync(Guid recipientUserId, NotificationDto notification, CancellationToken cancellationToken = default)
        => _hubContext.Clients.Group(ChatHub.GroupName(recipientUserId))
            .SendAsync("ReceiveNotification", notification, cancellationToken);
}
