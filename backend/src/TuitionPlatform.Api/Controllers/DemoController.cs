using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Demo;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/demo")]
public class DemoController : ControllerBase
{
    private readonly IDemoService _demoService;

    public DemoController(IDemoService demoService)
    {
        _demoService = demoService;
    }

    [HttpPost]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<DemoRequestDto>> RequestDemo(CreateDemoRequestDto request, CancellationToken cancellationToken)
    {
        var result = await _demoService.CreateAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{demoId:guid}")]
    [Authorize(Roles = "Parent,Teacher")]
    public async Task<ActionResult<DemoRequestDto>> Update(Guid demoId, UpdateDemoStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await _demoService.UpdateStatusAsync(User.GetUserId(), demoId, request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("parent")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<IReadOnlyCollection<DemoRequestDto>>> ParentRequests(CancellationToken cancellationToken)
    {
        var result = await _demoService.GetParentRequestsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("teacher")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<IReadOnlyCollection<DemoRequestDto>>> TeacherRequests(CancellationToken cancellationToken)
    {
        var result = await _demoService.GetTeacherRequestsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}

