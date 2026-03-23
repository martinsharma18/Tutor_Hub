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
}

