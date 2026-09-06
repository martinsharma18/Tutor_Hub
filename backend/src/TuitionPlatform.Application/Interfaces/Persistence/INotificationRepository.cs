using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface INotificationRepository : IGenericRepository<Notification>
{
    Task<IReadOnlyCollection<Notification>> GetByUserIdAsync(Guid userId, int take, CancellationToken cancellationToken = default);

    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);

    Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
}
