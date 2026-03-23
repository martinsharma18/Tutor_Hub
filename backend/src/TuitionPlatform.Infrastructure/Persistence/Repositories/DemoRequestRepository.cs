using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class DemoRequestRepository : GenericRepository<DemoRequest>, IDemoRequestRepository
{
    public DemoRequestRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<DemoRequest>> GetTeacherRequestsAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var items = await DbContext.DemoRequests
            .Include(d => d.ParentProfile).ThenInclude(p => p.User)
            .Where(d => d.TeacherProfileId == teacherProfileId)
            .ToListAsync(cancellationToken);
        return items;
    }

    public async Task<IReadOnlyCollection<DemoRequest>> GetParentRequestsAsync(Guid parentProfileId, CancellationToken cancellationToken = default)
    {
        var items = await DbContext.DemoRequests
            .Include(d => d.TeacherProfile).ThenInclude(t => t.User)
            .Where(d => d.ParentProfileId == parentProfileId)
            .ToListAsync(cancellationToken);
        return items;
    }
}

