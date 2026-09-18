using TuitionPlatform.Application.DTOs.Messages;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IMessageService
{
    Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<MessageDto>> GetConversationAsync(Guid userId, Guid otherUserId, int take, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<ConversationSummaryDto>> GetInboxAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>Everyone this user may currently message — mirrors the same rule the send
    /// endpoint enforces, so the UI can't offer a conversation the API will reject.</summary>
    Task<IReadOnlyCollection<MessageContactDto>> GetContactsAsync(Guid userId, CancellationToken cancellationToken = default);
}

