using TuitionPlatform.Application.DTOs.Admin;
using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IAdminService
{
    Task<AdminDashboardSummary> GetDashboardAsync(CancellationToken cancellationToken = default);

    Task<CommissionSettingsRequest> GetSettingsAsync(CancellationToken cancellationToken = default);

    Task<CommissionSettingsRequest> UpdateSettingsAsync(CommissionSettingsRequest request, CancellationToken cancellationToken = default);

    Task<TeacherProfileDto> ApproveTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<TeacherProfileDto> FeatureTeacherAsync(FeaturedTeacherRequest request, CancellationToken cancellationToken = default);

    Task<AdminTeacherDetailsDto> GetTeacherDetailsAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);

    Task<UserDto> UpdateUserStatusAsync(Guid userId, bool isActive, CancellationToken cancellationToken = default);

    Task<UserDto> UpdateUserRoleAsync(Guid userId, string role, CancellationToken cancellationToken = default);

    Task<List<TeacherApplicationDto>> GetAllApplicationsAsync(CancellationToken cancellationToken = default);

    Task RemoveTeacherAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);
}

