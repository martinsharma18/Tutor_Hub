using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Messages;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Services.Messages;

public class MessageService : IMessageService
{
    private readonly IUserRepository _userRepository;
    private readonly IMessageRepository _messageRepository;
    private readonly IPlacementRepository _placementRepository;
    private readonly ITeacherProfileRepository _teacherProfileRepository;
    private readonly INotificationService _notificationService;
    private readonly IRealtimeNotifier _realtimeNotifier;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public MessageService(
        IUserRepository userRepository,
        IMessageRepository messageRepository,
        IPlacementRepository placementRepository,
        ITeacherProfileRepository teacherProfileRepository,
        INotificationService notificationService,
        IRealtimeNotifier realtimeNotifier,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _messageRepository = messageRepository;
        _placementRepository = placementRepository;
        _teacherProfileRepository = teacherProfileRepository;
        _notificationService = notificationService;
        _realtimeNotifier = realtimeNotifier;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequest request, CancellationToken cancellationToken = default)
    {
        var sender = await _userRepository.GetByIdAsync(senderId, cancellationToken) ?? throw new NotFoundException("User", senderId);
        var receiver = await _userRepository.GetByIdAsync(request.ReceiverId, cancellationToken)
                       ?? throw new NotFoundException("User", request.ReceiverId);

        // Previously any authenticated user could message any other user by GUID with no
        // relationship check — an open spam/harassment channel and a way to route around the
        // commission paywall entirely. Now requires a shared application or demo request.
        if (!await CanMessageAsync(sender, receiver, cancellationToken))
        {
            throw new ForbiddenException("You can only message someone you have an active application or demo request with.");
        }

        var conversationKey = await _messageRepository.GetConversationKeyAsync(sender.Id, receiver.Id);
        var message = new Message
        {
            SenderId = sender.Id,
            ReceiverId = receiver.Id,
            ConversationKey = conversationKey,
            Body = request.Body,
            SentAtUtc = DateTime.UtcNow
        };

        await _messageRepository.AddAsync(message, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = _mapper.Map<MessageDto>(message);
        await _realtimeNotifier.NotifyNewMessageAsync(receiver.Id, dto, cancellationToken);

        await _notificationService.NotifyAsync(
            receiver.Id,
            "NewMessage",
            $"New message from {sender.FullName}",
            request.Body.Length > 120 ? request.Body[..120] + "…" : request.Body,
            null,
            cancellationToken);

        return dto;
    }

    public async Task<IReadOnlyCollection<MessageDto>> GetConversationAsync(Guid userId, Guid otherUserId, int take, CancellationToken cancellationToken = default)
    {
        var conversationKey = await _messageRepository.GetConversationKeyAsync(userId, otherUserId);
        var messages = await _messageRepository.GetConversationAsync(conversationKey, take, cancellationToken);

        // Opening a conversation is the natural "read" signal — no separate mark-as-read
        // round trip needed for the common case.
        await _messageRepository.MarkConversationAsReadAsync(userId, conversationKey, cancellationToken);

        return messages
            .OrderByDescending(m => m.SentAtUtc)
            .Select(_mapper.Map<MessageDto>)
            .ToList();
    }

    public async Task<IReadOnlyCollection<ConversationSummaryDto>> GetInboxAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var lastMessages = await _messageRepository.GetInboxAsync(userId, cancellationToken);
        var summaries = new List<ConversationSummaryDto>();

        foreach (var message in lastMessages)
        {
            var otherUserId = message.SenderId == userId ? message.ReceiverId : message.SenderId;
            var otherUser = await _userRepository.GetByIdAsync(otherUserId, cancellationToken);

            summaries.Add(new ConversationSummaryDto
            {
                OtherUserId = otherUserId,
                OtherUserName = otherUser?.FullName ?? "Unknown user",
                LastMessageBody = message.Body,
                LastMessageAtUtc = message.SentAtUtc,
                LastMessageIsUnread = message.ReceiverId == userId && !message.IsRead
            });
        }

        return summaries;
    }

    public Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
        => _messageRepository.GetUnreadCountAsync(userId, cancellationToken);

    public async Task<IReadOnlyCollection<MessageContactDto>> GetContactsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
                   ?? throw new NotFoundException("User", userId);

        // Admin is the platform's communication hub, so they get every active parent and teacher —
        // not just people who already wrote in. Returning only existing threads would mean admin
        // could reply but never initiate, which is useless when the whole model routes users to
        // the office first.
        if (user.Role == UserRole.Admin)
        {
            var reachable = await _userRepository.ListAsync(
                u => u.IsActive && !u.IsDeleted && (u.Role == UserRole.Parent || u.Role == UserRole.Teacher),
                cancellationToken);

            return reachable
                .OrderBy(u => u.FullName)
                .Select(u => new MessageContactDto
                {
                    UserId = u.Id,
                    Name = u.FullName,
                    Role = u.Role.ToString(),
                    Context = u.Role == UserRole.Parent ? "Parent" : "Teacher"
                })
                .ToList();
        }

        var contacts = new List<MessageContactDto>();

        // Support is always reachable — this is the intended channel before a tuition starts.
        var admins = await _userRepository.ListAsync(u => u.Role == UserRole.Admin && u.IsActive, cancellationToken);
        contacts.AddRange(admins.Select(a => new MessageContactDto
        {
            UserId = a.Id,
            Name = a.FullName,
            Role = "Admin",
            Context = "Support"
        }));

        if (user.Role == UserRole.Parent)
        {
            var placements = await _placementRepository.GetForParentAsync(userId, cancellationToken);
            contacts.AddRange(placements
                .Where(p => p.Status is PlacementStatus.Active or PlacementStatus.Paused)
                .Select(p => new MessageContactDto
                {
                    UserId = p.TeacherProfile.UserId,
                    Name = p.TeacherProfile.User?.FullName ?? "Teacher",
                    Role = "Teacher",
                    Context = p.Subject
                }));
        }
        else if (user.Role == UserRole.Teacher)
        {
            var profile = await _teacherProfileRepository.GetByUserIdAsync(userId, cancellationToken);
            if (profile is not null)
            {
                var placements = await _placementRepository.GetForTeacherAsync(profile.Id, cancellationToken);
                contacts.AddRange(placements
                    .Where(p => p.Status is PlacementStatus.Active or PlacementStatus.Paused)
                    .Select(p => new MessageContactDto
                    {
                        UserId = p.ParentUserId,
                        Name = p.ParentUser?.FullName ?? "Parent",
                        Role = "Parent",
                        Context = p.Subject
                    }));
            }
        }

        // Two placements with the same person (e.g. two subjects) shouldn't appear twice.
        return contacts
            .GroupBy(c => c.UserId)
            .Select(g => g.First())
            .ToList();
    }

    /// <summary>
    /// Admin can always talk to anyone — they are the intended channel before a tuition starts.
    ///
    /// Parent and teacher can only talk directly once a live Placement connects them. Previously
    /// this opened the moment a teacher applied, which meant a teacher could ask for the parent's
    /// number in chat and skip the commission entirely — every other safeguard in the platform was
    /// bypassable through that one hole. Before a placement exists, both sides route through admin.
    /// </summary>
    private async Task<bool> CanMessageAsync(User sender, User receiver, CancellationToken cancellationToken)
    {
        if (sender.Role == UserRole.Admin || receiver.Role == UserRole.Admin)
        {
            return true;
        }

        var (parentUserId, teacherUserId) = sender.Role == UserRole.Parent
            ? (sender.Id, receiver.Id)
            : (receiver.Id, sender.Id);

        return await _placementRepository.HasLivePlacementBetweenAsync(parentUserId, teacherUserId, cancellationToken);
    }
}
