using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class MessageRepository : GenericRepository<Message>, IMessageRepository
{
    public MessageRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<Message>> GetConversationAsync(Guid conversationKey, int take, CancellationToken cancellationToken = default)
    {
        var items = await DbContext.Messages
            .Where(m => m.ConversationKey == conversationKey)
            .OrderByDescending(m => m.SentAtUtc)
            .Take(take)
            .ToListAsync(cancellationToken);

        return items;
    }

    public Task<Guid> GetConversationKeyAsync(Guid userA, Guid userB)
    {
        var ordered = new[] { userA, userB }.OrderBy(g => g).ToArray();
        var buffer = ordered.SelectMany(g => g.ToByteArray()).ToArray();
        var hash = MD5.HashData(buffer);
        return Task.FromResult(new Guid(hash));
    }

    public async Task<IReadOnlyCollection<Message>> GetInboxAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        // Loads all of the user's messages then groups in memory — fine at current message
        // volumes; revisit with a windowed SQL query if a single user's history grows large.
        var messages = await DbContext.Messages
            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
            .ToListAsync(cancellationToken);

        return messages
            .GroupBy(m => m.ConversationKey)
            .Select(g => g.OrderByDescending(m => m.SentAtUtc).First())
            .OrderByDescending(m => m.SentAtUtc)
            .ToList();
    }

    public Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
        => DbContext.Messages.CountAsync(m => m.ReceiverId == userId && !m.IsRead, cancellationToken);

    public async Task MarkConversationAsReadAsync(Guid userId, Guid conversationKey, CancellationToken cancellationToken = default)
    {
        await DbContext.Messages
            .Where(m => m.ConversationKey == conversationKey && m.ReceiverId == userId && !m.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.IsRead, true), cancellationToken);
    }
}

