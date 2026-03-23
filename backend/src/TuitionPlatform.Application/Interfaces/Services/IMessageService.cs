using TuitionPlatform.Application.DTOs.Messages;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IMessageService
{
    Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<MessageDto>> GetConversationAsync(Guid userId, Guid otherUserId, int take, CancellationToken cancellationToken = default);
}

