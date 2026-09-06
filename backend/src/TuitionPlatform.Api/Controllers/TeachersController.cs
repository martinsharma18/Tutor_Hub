using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/teachers")]
[Authorize(Roles = "Teacher")]
public class TeachersController : ControllerBase
{
    private readonly ITeacherService _teacherService;
    private readonly IApplicationWorkflowService _applicationWorkflowService;

    public TeachersController(ITeacherService teacherService, IApplicationWorkflowService applicationWorkflowService)
    {
        _teacherService = teacherService;
        _applicationWorkflowService = applicationWorkflowService;
    }

    [HttpGet("me")]
    public async Task<ActionResult<TeacherProfileDto>> GetProfile(CancellationToken cancellationToken)
    {
        var result = await _teacherService.GetProfileAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPut("me")]
    public async Task<ActionResult<TeacherProfileDto>> UpdateProfile(UpdateTeacherProfileRequest request, CancellationToken cancellationToken)
    {
        var result = await _teacherService.UpdateProfileAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpPost("applications")]
    public async Task<ActionResult<TeacherApplicationDto>> Apply(CreateTeacherApplicationRequest request, CancellationToken cancellationToken)
    {
        var result = await _teacherService.ApplyToPostAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("applications")]
    public async Task<ActionResult<IReadOnlyCollection<TeacherApplicationDto>>> ListApplications(CancellationToken cancellationToken)
    {
        // Routed through the workflow service (not ITeacherService) because only this path
        // applies ContactVisibility masking to the parent's phone number before payment.
        var result = await _applicationWorkflowService.GetMyApplicationsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}

