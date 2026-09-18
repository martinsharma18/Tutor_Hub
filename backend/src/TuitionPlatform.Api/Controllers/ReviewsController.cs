using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Reviews;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpPost]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<ReviewDto>> Create(CreateReviewRequest request, CancellationToken cancellationToken)
    {
        var result = await _reviewService.CreateAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("teacher/{teacherProfileId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<TeacherRatingSummaryDto>> GetForTeacher(Guid teacherProfileId, CancellationToken cancellationToken)
    {
        var result = await _reviewService.GetForTeacherAsync(teacherProfileId, cancellationToken);
        return Ok(result);
    }
}
