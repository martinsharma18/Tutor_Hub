using AutoMapper;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Notifications;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Services.Notifications;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmailSender _emailSender;
    private readonly IRealtimeNotifier _realtimeNotifier;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public NotificationService(
        INotificationRepository notificationRepository,
        IUserRepository userRepository,
        IEmailSender emailSender,
        IRealtimeNotifier realtimeNotifier,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _emailSender = emailSender;
        _realtimeNotifier = realtimeNotifier;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task NotifyAsync(Guid userId, string type, string title, string body, string? linkUrl = null, CancellationToken cancellationToken = default)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Body = body,
            LinkUrl = linkUrl,
            IsRead = false
        };

        await _notificationRepository.AddAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _realtimeNotifier.NotifyNotificationAsync(userId, _mapper.Map<NotificationDto>(notification), cancellationToken);

        // Best-effort side channel: a user with no email, or an unconfigured SMTP host, must
        // never block the in-app notification (already saved above) from succeeding.
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);
        if (user is not null && !string.IsNullOrWhiteSpace(user.Email))
        {
            await _emailSender.SendAsync(user.Email, title, body, cancellationToken);
        }
    }

    public async Task<IReadOnlyCollection<NotificationDto>> GetMyNotificationsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var notifications = await _notificationRepository.GetByUserIdAsync(userId, 50, cancellationToken);
        return notifications.Select(_mapper.Map<NotificationDto>).ToList();
    }

    public Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
        => _notificationRepository.GetUnreadCountAsync(userId, cancellationToken);

    public async Task MarkAsReadAsync(Guid userId, Guid notificationId, CancellationToken cancellationToken = default)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId, cancellationToken)
                            ?? throw new NotFoundException("Notification", notificationId);

        if (notification.UserId != userId)
        {
            throw new ForbiddenException("You cannot modify another user's notification.");
        }

        notification.IsRead = true;
        _notificationRepository.Update(notification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await _notificationRepository.MarkAllAsReadAsync(userId, cancellationToken);
    }
}
