using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.Admin;
using TuitionPlatform.Application.DTOs.Teachers;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IAdminService
{
    Task<AdminDashboardSummary> GetDashboardAsync(CancellationToken cancellationToken = default);

    Task<CommissionSettingsRequest> GetSettingsAsync(CancellationToken cancellationToken = default);

    Task<CommissionSettingsRequest> UpdateSettingsAsync(Guid actorUserId, CommissionSettingsRequest request, CancellationToken cancellationToken = default);

    Task<TeacherProfileDto> ApproveTeacherAsync(Guid actorUserId, Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<TeacherProfileDto> FeatureTeacherAsync(Guid actorUserId, FeaturedTeacherRequest request, CancellationToken cancellationToken = default);

    Task<AdminTeacherDetailsDto> GetTeacherDetailsAsync(Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<List<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);

    Task<List<TeacherProfileDto>> GetAllTeachersAsync(CancellationToken cancellationToken = default);

    Task<UserDto> UpdateUserStatusAsync(Guid actorUserId, Guid userId, bool isActive, CancellationToken cancellationToken = default);

    Task<UserDto> UpdateUserRoleAsync(Guid actorUserId, Guid userId, string role, CancellationToken cancellationToken = default);

    Task<List<TeacherApplicationDto>> GetAllApplicationsAsync(CancellationToken cancellationToken = default);

    Task RemoveTeacherAsync(Guid actorUserId, Guid teacherProfileId, CancellationToken cancellationToken = default);

    Task<PagedResult<AuditLogDto>> GetAuditLogAsync(PagedRequest request, CancellationToken cancellationToken = default);
}
