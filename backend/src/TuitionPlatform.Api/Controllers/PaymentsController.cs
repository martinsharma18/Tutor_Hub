using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Payments;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("commission")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PaymentDto>> CreateCommission(CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        var result = await _paymentService.CreateCommissionAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpPost("{paymentId:guid}/pay")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<PaymentDto>> MarkPaid(Guid paymentId, [FromBody] string? reference, CancellationToken cancellationToken)
    {
        var result = await _paymentService.MarkAsPaidAsync(User.GetUserId(), paymentId, reference, cancellationToken);
        return Ok(result);
    }

    [HttpGet("teacher")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<IReadOnlyCollection<PaymentDto>>> TeacherPayments(CancellationToken cancellationToken)
    {
        var result = await _paymentService.GetTeacherPaymentsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("parent")]
    [Authorize(Roles = "Parent")]
    public async Task<ActionResult<IReadOnlyCollection<PaymentDto>>> ParentPayments(CancellationToken cancellationToken)
    {
        var result = await _paymentService.GetParentPaymentsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }
}

