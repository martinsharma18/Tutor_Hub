using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Application.DTOs.Admin;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<AdminDashboardSummary>> Dashboard(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetDashboardAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("settings")]
    public async Task<ActionResult<CommissionSettingsRequest>> GetSettings(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetSettingsAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPut("settings")]
    public async Task<ActionResult<CommissionSettingsRequest>> UpdateSettings(CommissionSettingsRequest request, CancellationToken cancellationToken)
    {
        var result = await _adminService.UpdateSettingsAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpPost("teachers/{teacherProfileId:guid}/approve")]
    public async Task<ActionResult<TeacherProfileDto>> ApproveTeacher(Guid teacherProfileId, CancellationToken cancellationToken)
    {
        var result = await _adminService.ApproveTeacherAsync(teacherProfileId, cancellationToken);
        return Ok(result);
    }

    [HttpGet("teachers/{teacherProfileId:guid}")]
    public async Task<ActionResult<AdminTeacherDetailsDto>> GetTeacherDetails(Guid teacherProfileId, CancellationToken cancellationToken)
    {
        var result = await _adminService.GetTeacherDetailsAsync(teacherProfileId, cancellationToken);
        return Ok(result);
    }

    [HttpPost("teachers/feature")]
    public async Task<ActionResult<TeacherProfileDto>> FeatureTeacher(FeaturedTeacherRequest request, CancellationToken cancellationToken)
    {
        var result = await _adminService.FeatureTeacherAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetAllUsersAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("applications")]
    public async Task<ActionResult<List<TeacherApplicationDto>>> ListApplications(CancellationToken cancellationToken)
    {
        var result = await _adminService.GetAllApplicationsAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPatch("users/{userId:guid}/status")]
    public async Task<ActionResult<UserDto>> UpdateUserStatus(Guid userId, [FromBody] bool isActive, CancellationToken cancellationToken)
    {
        var result = await _adminService.UpdateUserStatusAsync(userId, isActive, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("users/{userId:guid}/role")]
    public async Task<ActionResult<UserDto>> UpdateUserRole(Guid userId, [FromBody] string role, CancellationToken cancellationToken)
    {
        var result = await _adminService.UpdateUserRoleAsync(userId, role, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("teachers/{teacherProfileId:guid}")]
    public async Task<ActionResult> DeleteTeacher(Guid teacherProfileId, CancellationToken cancellationToken)
    {
        await _adminService.RemoveTeacherAsync(teacherProfileId, cancellationToken);
        return NoContent();
    }
}

