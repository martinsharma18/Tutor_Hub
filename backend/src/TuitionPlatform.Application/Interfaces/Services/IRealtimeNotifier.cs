using TuitionPlatform.Application.DTOs.Messages;
using TuitionPlatform.Application.DTOs.Notifications;

namespace TuitionPlatform.Application.Interfaces.Services;

/// <summary>
/// Pushes events to a connected client over whatever live-transport the API layer implements
/// (SignalR today). Kept as an Application-layer abstraction so Application never references
/// ASP.NET Core SignalR types directly — the real implementation lives in the Api project.
/// </summary>
public interface IRealtimeNotifier
{
    Task NotifyNewMessageAsync(Guid recipientUserId, MessageDto message, CancellationToken cancellationToken = default);

    Task NotifyNotificationAsync(Guid recipientUserId, NotificationDto notification, CancellationToken cancellationToken = default);
}
