using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Messages;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Application.Services.Messages;

public class MessageService : IMessageService
{
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MessageService(
        IUserRepository userRepository,
        IMessageRepository messageRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _messageRepository = messageRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequest request, CancellationToken cancellationToken = default)
    {
        var sender = await _userRepository.GetByIdAsync(senderId, cancellationToken) ?? throw new NotFoundException("User", senderId);
        var receiver = await _userRepository.GetByIdAsync(request.ReceiverId, cancellationToken)
                       ?? throw new NotFoundException("User", request.ReceiverId);

        var conversationKey = await _messageRepository.GetConversationKeyAsync(sender.Id, receiver.Id);
        var message = new Domain.Entities.Message
        {
            SenderId = sender.Id,
            ReceiverId = receiver.Id,
            ConversationKey = conversationKey,
            Body = request.Body,
            SentAtUtc = DateTime.UtcNow
        };

        await _messageRepository.AddAsync(message, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<MessageDto>(message);
    }

    public async Task<IReadOnlyCollection<MessageDto>> GetConversationAsync(Guid userId, Guid otherUserId, int take, CancellationToken cancellationToken = default)
    {
        var conversationKey = await _messageRepository.GetConversationKeyAsync(userId, otherUserId);
        var messages = await _messageRepository.GetConversationAsync(conversationKey, take, cancellationToken);
        return messages
            .OrderByDescending(m => m.SentAtUtc)
            .Select(_mapper.Map<MessageDto>)
            .ToList();
    }
}

