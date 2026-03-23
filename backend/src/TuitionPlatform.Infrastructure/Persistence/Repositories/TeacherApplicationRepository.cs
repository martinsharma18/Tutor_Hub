using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class TeacherApplicationRepository : GenericRepository<TeacherApplication>, ITeacherApplicationRepository
{
    public TeacherApplicationRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyCollection<TeacherApplication>> GetByPostIdAsync(Guid postId, CancellationToken cancellationToken = default)
    {
        var items = await DbContext.TeacherApplications
            .Include(a => a.TeacherProfile).ThenInclude(t => t.User)
            .Include(a => a.TuitionPost)
            .Where(a => a.TuitionPostId == postId)
            .ToListAsync(cancellationToken);

        return items;
    }

    public async Task<IReadOnlyCollection<TeacherApplication>> GetByTeacherIdAsync(Guid teacherProfileId, CancellationToken cancellationToken = default)
    {
        var items = await DbContext.TeacherApplications
            .Include(a => a.TuitionPost)
            .Where(a => a.TeacherProfileId == teacherProfileId)
            .ToListAsync(cancellationToken);

        return items;
    }

    public Task<TeacherApplication?> GetDetailedByIdAsync(Guid applicationId, CancellationToken cancellationToken = default)
        => DbContext.TeacherApplications
            .Include(a => a.TeacherProfile)
                .ThenInclude(t => t.User)
            .Include(a => a.TuitionPost)
            .FirstOrDefaultAsync(a => a.Id == applicationId, cancellationToken);
}

