using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IMessageRepository : IGenericRepository<Message>
{
    Task<IReadOnlyCollection<Message>> GetConversationAsync(Guid conversationKey, int take, CancellationToken cancellationToken = default);

    Task<Guid> GetConversationKeyAsync(Guid userA, Guid userB);

    /// <summary>Most recent message per conversation the user participates in — feeds the inbox list.</summary>
    Task<IReadOnlyCollection<Message>> GetInboxAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);

    Task MarkConversationAsReadAsync(Guid userId, Guid conversationKey, CancellationToken cancellationToken = default);
}

