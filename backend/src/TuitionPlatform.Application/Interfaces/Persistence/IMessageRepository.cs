using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IMessageRepository : IGenericRepository<Message>
{
    Task<IReadOnlyCollection<Message>> GetConversationAsync(Guid conversationKey, int take, CancellationToken cancellationToken = default);

    Task<Guid> GetConversationKeyAsync(Guid userA, Guid userB);
}

