using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IApplicationWorkflowService
{
    Task<IReadOnlyCollection<TeacherApplicationDto>> GetMyApplicationsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<TeacherApplicationDto>> GetApplicationsForPostAsync(
        Guid requesterId,
        Guid postId,
        CancellationToken cancellationToken = default);

    Task<TeacherApplicationDto> UpdateStatusAsync(
        Guid requesterId,
        Guid applicationId,
        UpdateApplicationStatusRequest request,
        CancellationToken cancellationToken = default);

    Task<TeacherApplicationDto> VerifyPaymentAsync(
        Guid requesterId,
        Guid applicationId,
        CancellationToken cancellationToken = default);
}


