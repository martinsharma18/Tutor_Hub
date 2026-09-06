using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IPlacementRepository : IGenericRepository<Placement>
{
    /// <summary>Loads a placement with parent, teacher and teacher's user — needed for any DTO
    /// that shows names on either side.</summary>
    Task<Placement?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Placement>> GetForParentAsync(Guid parentUserId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Placement>> GetForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<(IReadOnlyCollection<Placement> Items, int TotalCount)> GetPagedAsync(
        PlacementStatus? status, int page, int pageSize, CancellationToken cancellationToken = default);

    /// <summary>Every placement that should be billed for a period — drives monthly invoice generation.</summary>
    Task<IReadOnlyCollection<Placement>> GetActiveForBillingAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// True when these two users are connected by a live placement. Gates direct parent-teacher
    /// messaging: before a placement exists they talk through admin, which is what keeps the
    /// commission enforceable.
    /// </summary>
    Task<bool> HasLivePlacementBetweenAsync(Guid parentUserId, Guid teacherUserId, CancellationToken cancellationToken = default);
}

public interface IInvoiceRepository : IGenericRepository<Invoice>
{
    Task<Invoice?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Invoice>> GetByPlacementAsync(Guid placementId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Invoice>> GetForParentAsync(Guid parentUserId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<Invoice>> GetForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<bool> ExistsForPeriodAsync(Guid placementId, DateOnly periodStart, CancellationToken cancellationToken = default);

    Task<(IReadOnlyCollection<Invoice> Items, int TotalCount)> GetPagedAsync(
        InvoiceStatus? status, int page, int pageSize, CancellationToken cancellationToken = default);
}

public interface IClassSessionRepository : IGenericRepository<ClassSession>
{
    Task<IReadOnlyCollection<ClassSession>> GetByPlacementAsync(Guid placementId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<ClassSession>> GetUpcomingForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<ClassSession>> GetUpcomingForParentAsync(Guid parentUserId, CancellationToken cancellationToken = default);
}

public interface IPlacementFeedbackRepository : IGenericRepository<PlacementFeedback>
{
    Task<IReadOnlyCollection<PlacementFeedback>> GetByPlacementAsync(Guid placementId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<PlacementFeedback>> GetAtRiskAsync(CancellationToken cancellationToken = default);
}
