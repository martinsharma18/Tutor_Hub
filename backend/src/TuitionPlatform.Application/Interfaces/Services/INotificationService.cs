using TuitionPlatform.Application.DTOs.Notifications;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface INotificationService
{
    /// <summary>
    /// Always creates the in-app notification; additionally emails the user if they have an
    /// address on file. Call this from workflow services on the events users care about — never
    /// swallow it silently, an event with no notification is invisible to the user who needs it.
    /// </summary>
    Task NotifyAsync(Guid userId, string type, string title, string body, string? linkUrl = null, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<NotificationDto>> GetMyNotificationsAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);

    Task MarkAsReadAsync(Guid userId, Guid notificationId, CancellationToken cancellationToken = default);

    Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
}
