using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IApplicationWorkflowService
{
    Task<IReadOnlyCollection<TeacherApplicationDto>> GetApplicationsForPostAsync(
        Guid requesterId,
        Guid postId,
        CancellationToken cancellationToken = default);

    Task<TeacherApplicationDto> UpdateStatusAsync(
        Guid requesterId,
        Guid applicationId,
        UpdateApplicationStatusRequest request,
        CancellationToken cancellationToken = default);
}


