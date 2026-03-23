using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface ITeacherService
{
    Task<TeacherProfileDto> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<TeacherProfileDto> UpdateProfileAsync(Guid userId, UpdateTeacherProfileRequest request, CancellationToken cancellationToken = default);

    Task<TeacherApplicationDto> ApplyToPostAsync(Guid userId, CreateTeacherApplicationRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TeacherApplicationDto>> GetMyApplicationsAsync(Guid userId, CancellationToken cancellationToken = default);
}

