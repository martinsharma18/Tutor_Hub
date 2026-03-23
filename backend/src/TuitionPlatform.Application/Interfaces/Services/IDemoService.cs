using TuitionPlatform.Application.DTOs.Demo;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IDemoService
{
    Task<DemoRequestDto> CreateAsync(Guid parentUserId, CreateDemoRequestDto request, CancellationToken cancellationToken = default);

    Task<DemoRequestDto> UpdateStatusAsync(Guid userId, Guid demoId, UpdateDemoStatusRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<DemoRequestDto>> GetParentRequestsAsync(Guid parentUserId, CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<DemoRequestDto>> GetTeacherRequestsAsync(Guid teacherUserId, CancellationToken cancellationToken = default);
}

