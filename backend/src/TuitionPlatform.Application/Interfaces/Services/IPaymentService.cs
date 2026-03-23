using TuitionPlatform.Application.DTOs.Payments;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<PaymentDto> CreateCommissionAsync(Guid adminUserId, CreatePaymentRequest request, CancellationToken cancellationToken = default);

    Task<PaymentDto> MarkAsPaidAsync(Guid teacherUserId, Guid paymentId, string? reference, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<PaymentDto>> GetTeacherPaymentsAsync(Guid teacherUserId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<PaymentDto>> GetParentPaymentsAsync(Guid parentUserId, CancellationToken cancellationToken = default);
}

