using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.Common.Models;
using TuitionPlatform.Application.DTOs.Placements;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/placements")]
public class PlacementsController : ControllerBase
{
    private readonly IPlacementService _placementService;
    private readonly IInvoiceService _invoiceService;

    public PlacementsController(IPlacementService placementService, IInvoiceService invoiceService)
    {
        _placementService = placementService;
        _invoiceService = invoiceService;
    }

    /// <summary>Authorization lives in the service — it checks the caller is the parent, the
    /// assigned teacher, or an admin, and controls how much of the fee breakdown is returned.</summary>
    [HttpGet("{placementId:guid}")]
    public async Task<ActionResult<PlacementDto>> GetById(Guid placementId, CancellationToken cancellationToken)
    {
        var result = await _placementService.GetByIdAsync(User.GetUserId(), placementId, cancellationToken);
        return Ok(result);
    }

    [HttpGet("parent")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<IReadOnlyCollection<PlacementDto>>> MyTuitions(CancellationToken cancellationToken)
    {
        var result = await _placementService.GetMyPlacementsAsParentAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("teacher")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<IReadOnlyCollection<PlacementDto>>> MyAssignments(CancellationToken cancellationToken)
    {
        var result = await _placementService.GetMyPlacementsAsTeacherAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("parent/invoices")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<IReadOnlyCollection<InvoiceDto>>> MyInvoices(CancellationToken cancellationToken)
    {
        var result = await _invoiceService.GetMyInvoicesAsParentAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("teacher/earnings")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<IReadOnlyCollection<InvoiceDto>>> MyEarnings(CancellationToken cancellationToken)
    {
        var result = await _invoiceService.GetMyEarningsAsTeacherAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}
