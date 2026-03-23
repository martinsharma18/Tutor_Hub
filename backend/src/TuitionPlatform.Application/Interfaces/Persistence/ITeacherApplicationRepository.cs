using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface ITeacherApplicationRepository : IGenericRepository<TeacherApplication>
{
    Task<IReadOnlyCollection<TeacherApplication>> GetByPostIdAsync(Guid postId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TeacherApplication>> GetByTeacherIdAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<TeacherApplication?> GetDetailedByIdAsync(Guid applicationId, CancellationToken cancellationToken = default);
}

