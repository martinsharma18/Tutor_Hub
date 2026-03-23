using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<Payment>> GetTeacherPaymentsAsync(Guid teacherId, CancellationToken cancellationToken = default)
    {
        var items = await DbContext.Payments
            .Where(p => p.TeacherId == teacherId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        return items;
    }

    public async Task<IReadOnlyCollection<Payment>> GetParentPaymentsAsync(Guid parentId, CancellationToken cancellationToken = default)
    {
        var items = await DbContext.Payments
            .Where(p => p.ParentId == parentId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(cancellationToken);
        return items;
    }
}

