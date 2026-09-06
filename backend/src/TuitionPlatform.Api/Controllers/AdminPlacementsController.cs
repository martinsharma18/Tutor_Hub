using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.Placements;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/placements")]
public class AdminPlacementsController : ControllerBase
{
    private readonly IPlacementService _placementService;
    private readonly IInvoiceService _invoiceService;
    private readonly IPlacementFeedbackService _feedbackService;

    public AdminPlacementsController(
        IPlacementService placementService,
        IInvoiceService invoiceService,
        IPlacementFeedbackService feedbackService)
    {
        _placementService = placementService;
        _invoiceService = invoiceService;
        _feedbackService = feedbackService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<PlacementDto>>> List([FromQuery] string? status, [FromQuery] PagedRequest request, CancellationToken cancellationToken)
    {
        var result = await _placementService.GetPagedAsync(status, request, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<PlacementDto>> Create(CreatePlacementRequest request, CancellationToken cancellationToken)
    {
        var result = await _placementService.CreateAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpPut("{placementId:guid}")]
    public async Task<ActionResult<PlacementDto>> Update(Guid placementId, UpdatePlacementRequest request, CancellationToken cancellationToken)
    {
        var result = await _placementService.UpdateAsync(User.GetUserId(), placementId, request, cancellationToken);
        return Ok(result);
    }

    [HttpPost("{placementId:guid}/pause")]
    public async Task<ActionResult<PlacementDto>> Pause(Guid placementId, CancellationToken cancellationToken)
        => Ok(await _placementService.PauseAsync(User.GetUserId(), placementId, cancellationToken));

    [HttpPost("{placementId:guid}/resume")]
    public async Task<ActionResult<PlacementDto>> Resume(Guid placementId, CancellationToken cancellationToken)
        => Ok(await _placementService.ResumeAsync(User.GetUserId(), placementId, cancellationToken));

    [HttpPost("{placementId:guid}/end")]
    public async Task<ActionResult<PlacementDto>> End(Guid placementId, EndPlacementRequest request, CancellationToken cancellationToken)
        => Ok(await _placementService.EndAsync(User.GetUserId(), placementId, request, cancellationToken));

    // ---- invoices ----

    [HttpGet("invoices")]
    public async Task<ActionResult<PagedResult<InvoiceDto>>> Invoices([FromQuery] string? status, [FromQuery] PagedRequest request, CancellationToken cancellationToken)
        => Ok(await _invoiceService.GetPagedAsync(status, request, cancellationToken));

    /// <summary>
    /// Generates this month's invoices for every active placement. Idempotent, so it is safe to
    /// press twice — until a scheduled job exists this is the manual trigger.
    /// </summary>
    [HttpPost("invoices/generate")]
    public async Task<ActionResult> GenerateInvoices([FromQuery] DateOnly? periodStart, CancellationToken cancellationToken)
    {
        var target = periodStart ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var created = await _invoiceService.GenerateMonthlyInvoicesAsync(target, cancellationToken);
        return Ok(new { created, period = new DateOnly(target.Year, target.Month, 1) });
    }

    [HttpPost("invoices/{invoiceId:guid}/mark-paid")]
    public async Task<ActionResult<InvoiceDto>> MarkPaid(Guid invoiceId, MarkInvoicePaidRequest request, CancellationToken cancellationToken)
        => Ok(await _invoiceService.MarkParentPaidAsync(User.GetUserId(), invoiceId, request, cancellationToken));

    [HttpPost("invoices/{invoiceId:guid}/pay-teacher")]
    public async Task<ActionResult<InvoiceDto>> PayTeacher(Guid invoiceId, CancellationToken cancellationToken)
        => Ok(await _invoiceService.MarkTeacherPaidOutAsync(User.GetUserId(), invoiceId, cancellationToken));

    // ---- feedback ----

    [HttpGet("{placementId:guid}/feedback")]
    public async Task<ActionResult<IReadOnlyCollection<PlacementFeedbackDto>>> Feedback(Guid placementId, CancellationToken cancellationToken)
        => Ok(await _feedbackService.GetForPlacementAsync(placementId, cancellationToken));

    [HttpPost("{placementId:guid}/feedback")]
    public async Task<ActionResult<PlacementFeedbackDto>> AddFeedback(Guid placementId, CreatePlacementFeedbackRequest request, CancellationToken cancellationToken)
        => Ok(await _feedbackService.AddAsync(User.GetUserId(), placementId, request, cancellationToken));

    /// <summary>Placements a parent has flagged as going badly — the follow-up queue.</summary>
    [HttpGet("at-risk")]
    public async Task<ActionResult<IReadOnlyCollection<PlacementFeedbackDto>>> AtRisk(CancellationToken cancellationToken)
        => Ok(await _feedbackService.GetAtRiskAsync(cancellationToken));
}
