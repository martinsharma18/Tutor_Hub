using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Teachers;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/applications")]
[Authorize(Roles = "Parent,Admin")]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationWorkflowService _applicationWorkflowService;

    public ApplicationsController(IApplicationWorkflowService applicationWorkflowService)
    {
        _applicationWorkflowService = applicationWorkflowService;
    }

    [HttpGet("posts/{postId:guid}")]
    public async Task<ActionResult<IReadOnlyCollection<TeacherApplicationDto>>> GetForPost(Guid postId, CancellationToken cancellationToken)
    {
        var result = await _applicationWorkflowService.GetApplicationsForPostAsync(User.GetUserId(), postId, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{applicationId:guid}")]
    public async Task<ActionResult<TeacherApplicationDto>> UpdateStatus(Guid applicationId, UpdateApplicationStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await _applicationWorkflowService.UpdateStatusAsync(User.GetUserId(), applicationId, request, cancellationToken);
        return Ok(result);
    }
}


