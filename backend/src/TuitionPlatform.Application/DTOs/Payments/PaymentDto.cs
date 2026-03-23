namespace TuitionPlatform.Application.DTOs.Payments;

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid ParentId { get; set; }
    public Guid TeacherId { get; set; }
    public Guid TuitionPostId { get; set; }
    public decimal Amount { get; set; }
    public decimal CommissionAmount { get; set; }
    public decimal TeacherNetAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ReferenceNumber { get; set; }
}

