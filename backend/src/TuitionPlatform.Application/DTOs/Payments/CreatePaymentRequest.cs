namespace TuitionPlatform.Application.DTOs.Payments;

public class CreatePaymentRequest
{
    public Guid TuitionPostId { get; set; }
    public Guid TeacherId { get; set; }
    public decimal Amount { get; set; }
    public string? ReferenceNumber { get; set; }
}

