using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class PlacementRepository : GenericRepository<Placement>, IPlacementRepository
{
    public PlacementRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    private IQueryable<Placement> Detailed => DbContext.Placements
        .Include(p => p.ParentUser)
        .Include(p => p.TeacherProfile).ThenInclude(t => t.User);

    public Task<Placement?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => Detailed.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task<IReadOnlyCollection<Placement>> GetForParentAsync(Guid parentUserId, CancellationToken cancellationToken = default)
        => await Detailed
            .Where(p => p.ParentUserId == parentUserId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Placement>> GetForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
        => await Detailed
            .Where(p => p.TeacherProfileId == teacherProfileId)
            .OrderByDescending(p => p.CreatedAtUtc)
            .ToListAsync(cancellationToken);

    public async Task<(IReadOnlyCollection<Placement> Items, int TotalCount)> GetPagedAsync(
        PlacementStatus? status, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = Detailed.AsQueryable();
        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(p => p.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    public async Task<IReadOnlyCollection<Placement>> GetActiveForBillingAsync(CancellationToken cancellationToken = default)
        // Paused placements are deliberately excluded — a paused tuition must not accrue charges.
        => await DbContext.Placements
            .Where(p => p.Status == PlacementStatus.Active)
            .ToListAsync(cancellationToken);

    public Task<bool> HasLivePlacementBetweenAsync(Guid parentUserId, Guid teacherUserId, CancellationToken cancellationToken = default)
        // Paused counts as live here: a temporary break (exams, holiday) shouldn't sever an
        // existing working relationship. Ended does not — that connection is over.
        => DbContext.Placements.AnyAsync(
            p => p.ParentUserId == parentUserId
                 && p.TeacherProfile.UserId == teacherUserId
                 && (p.Status == PlacementStatus.Active || p.Status == PlacementStatus.Paused),
            cancellationToken);
}

public class InvoiceRepository : GenericRepository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    private IQueryable<Invoice> Detailed => DbContext.Invoices
        .Include(i => i.Placement).ThenInclude(p => p.TeacherProfile).ThenInclude(t => t.User)
        .Include(i => i.Placement).ThenInclude(p => p.ParentUser);

    public Task<Invoice?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => Detailed.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);

    public async Task<IReadOnlyCollection<Invoice>> GetByPlacementAsync(Guid placementId, CancellationToken cancellationToken = default)
        => await Detailed
            .Where(i => i.PlacementId == placementId)
            .OrderByDescending(i => i.PeriodStart)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Invoice>> GetForParentAsync(Guid parentUserId, CancellationToken cancellationToken = default)
        => await Detailed
            .Where(i => i.Placement.ParentUserId == parentUserId)
            .OrderByDescending(i => i.PeriodStart)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<Invoice>> GetForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
        => await Detailed
            .Where(i => i.Placement.TeacherProfileId == teacherProfileId)
            .OrderByDescending(i => i.PeriodStart)
            .ToListAsync(cancellationToken);

    public Task<bool> ExistsForPeriodAsync(Guid placementId, DateOnly periodStart, CancellationToken cancellationToken = default)
        => DbContext.Invoices.AnyAsync(i => i.PlacementId == placementId && i.PeriodStart == periodStart, cancellationToken);

    public async Task<(IReadOnlyCollection<Invoice> Items, int TotalCount)> GetPagedAsync(
        InvoiceStatus? status, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = Detailed.AsQueryable();
        if (status.HasValue)
        {
            query = query.Where(i => i.Status == status.Value);
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(i => i.PeriodStart)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, total);
    }
}

public class ClassSessionRepository : GenericRepository<ClassSession>, IClassSessionRepository
{
    public ClassSessionRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<ClassSession>> GetByPlacementAsync(Guid placementId, CancellationToken cancellationToken = default)
        => await DbContext.ClassSessions
            .Where(s => s.PlacementId == placementId)
            .OrderBy(s => s.ScheduledAtUtc)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<ClassSession>> GetUpcomingForTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
        => await DbContext.ClassSessions
            .Include(s => s.Placement)
            .Where(s => s.Placement.TeacherProfileId == teacherProfileId
                        && s.Status == ClassSessionStatus.Scheduled
                        && s.ScheduledAtUtc >= DateTime.UtcNow.AddHours(-2))
            .OrderBy(s => s.ScheduledAtUtc)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<ClassSession>> GetUpcomingForParentAsync(Guid parentUserId, CancellationToken cancellationToken = default)
        // The 2-hour grace window keeps a class visible while it's actually running, so the
        // "join" link doesn't vanish the moment it starts.
        => await DbContext.ClassSessions
            .Include(s => s.Placement)
            .Where(s => s.Placement.ParentUserId == parentUserId
                        && s.Status == ClassSessionStatus.Scheduled
                        && s.ScheduledAtUtc >= DateTime.UtcNow.AddHours(-2))
            .OrderBy(s => s.ScheduledAtUtc)
            .ToListAsync(cancellationToken);
}

public class PlacementFeedbackRepository : GenericRepository<PlacementFeedback>, IPlacementFeedbackRepository
{
    public PlacementFeedbackRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<PlacementFeedback>> GetByPlacementAsync(Guid placementId, CancellationToken cancellationToken = default)
        => await DbContext.PlacementFeedback
            .Include(f => f.CollectedByAdminUser)
            .Where(f => f.PlacementId == placementId)
            .OrderByDescending(f => f.CreatedAtUtc)
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyCollection<PlacementFeedback>> GetAtRiskAsync(CancellationToken cancellationToken = default)
        => await DbContext.PlacementFeedback
            .Include(f => f.Placement).ThenInclude(p => p.ParentUser)
            .Include(f => f.Placement).ThenInclude(p => p.TeacherProfile).ThenInclude(t => t.User)
            .Where(f => f.IsAtRisk && f.Placement.Status == PlacementStatus.Active)
            .OrderByDescending(f => f.CreatedAtUtc)
            .ToListAsync(cancellationToken);
}
