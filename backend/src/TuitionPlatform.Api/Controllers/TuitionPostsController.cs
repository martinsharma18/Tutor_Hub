using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.TuitionPosts;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/tuition-posts")]
public class TuitionPostsController : ControllerBase
{
    private readonly ITuitionPostService _tuitionPostService;

    public TuitionPostsController(ITuitionPostService tuitionPostService)
    {
        _tuitionPostService = tuitionPostService;
    }

    [HttpPost]
    [Authorize(Roles = "Parent,Admin")]
    public async Task<ActionResult<TuitionPostDto>> Create(CreateTuitionPostRequest request, CancellationToken cancellationToken)
    {
        var result = await _tuitionPostService.CreateAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpPost("{postId:guid}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TuitionPostDto>> Approve(Guid postId, CancellationToken cancellationToken)
    {
        var result = await _tuitionPostService.ApproveAsync(User.GetUserId(), postId, cancellationToken);
        return Ok(result);
    }

    [HttpPatch("{postId:guid}/status")]
    [Authorize(Roles = "Parent,Admin")]
    public async Task<ActionResult<TuitionPostDto>> UpdateStatus(Guid postId, UpdateTuitionPostStatusRequest request, CancellationToken cancellationToken)
    {
        var result = await _tuitionPostService.UpdateStatusAsync(User.GetUserId(), postId, request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<PagedResult<TuitionPostDto>>> MyPosts([FromQuery] PagedRequest request, CancellationToken cancellationToken)
    {
        var result = await _tuitionPostService.GetMyPostsAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("open")]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<TuitionPostDto>>> OpenPosts([FromQuery] PagedRequest request, CancellationToken cancellationToken)
    {
        var result = await _tuitionPostService.GetOpenPostsAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PagedResult<TuitionPostDto>>> PendingPosts([FromQuery] PagedRequest request, CancellationToken cancellationToken)
    {
        var result = await _tuitionPostService.GetPendingPostsAsync(request, cancellationToken);
        return Ok(result);
    }
}

