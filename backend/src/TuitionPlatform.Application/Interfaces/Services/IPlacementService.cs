using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.Placements;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IPlacementService
{
    // ---- admin ----
    Task<PlacementDto> CreateAsync(Guid adminUserId, CreatePlacementRequest request, CancellationToken cancellationToken = default);
    Task<PlacementDto> UpdateAsync(Guid adminUserId, Guid placementId, UpdatePlacementRequest request, CancellationToken cancellationToken = default);
    Task<PlacementDto> PauseAsync(Guid adminUserId, Guid placementId, CancellationToken cancellationToken = default);
    Task<PlacementDto> ResumeAsync(Guid adminUserId, Guid placementId, CancellationToken cancellationToken = default);
    Task<PlacementDto> EndAsync(Guid adminUserId, Guid placementId, EndPlacementRequest request, CancellationToken cancellationToken = default);
    Task<PagedResult<PlacementDto>> GetPagedAsync(string? status, PagedRequest request, CancellationToken cancellationToken = default);

    // ---- per role ----
    Task<PlacementDto> GetByIdAsync(Guid requesterUserId, Guid placementId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<PlacementDto>> GetMyPlacementsAsParentAsync(Guid parentUserId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<PlacementDto>> GetMyPlacementsAsTeacherAsync(Guid teacherUserId, CancellationToken cancellationToken = default);
}

public interface IInvoiceService
{
    /// <summary>
    /// Creates the invoice for one placement for the month containing <paramref name="periodStart"/>.
    /// Idempotent — a placement already billed for that period is skipped, so re-running the
    /// monthly job never double-charges.
    /// </summary>
    Task<int> GenerateMonthlyInvoicesAsync(DateOnly periodStart, CancellationToken cancellationToken = default);

    Task<InvoiceDto> MarkParentPaidAsync(Guid adminUserId, Guid invoiceId, MarkInvoicePaidRequest request, CancellationToken cancellationToken = default);
    Task<InvoiceDto> MarkTeacherPaidOutAsync(Guid adminUserId, Guid invoiceId, CancellationToken cancellationToken = default);

    Task<PagedResult<InvoiceDto>> GetPagedAsync(string? status, PagedRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<InvoiceDto>> GetMyInvoicesAsParentAsync(Guid parentUserId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<InvoiceDto>> GetMyEarningsAsTeacherAsync(Guid teacherUserId, CancellationToken cancellationToken = default);
}

public interface IPlacementFeedbackService
{
    Task<PlacementFeedbackDto> AddAsync(Guid adminUserId, Guid placementId, CreatePlacementFeedbackRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<PlacementFeedbackDto>> GetForPlacementAsync(Guid placementId, CancellationToken cancellationToken = default);
    Task<IReadOnlyCollection<PlacementFeedbackDto>> GetAtRiskAsync(CancellationToken cancellationToken = default);
}
