using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Task<IReadOnlyCollection<Payment>> GetTeacherPaymentsAsync(Guid teacherId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Payment>> GetParentPaymentsAsync(Guid parentId, CancellationToken cancellationToken = default);
}

