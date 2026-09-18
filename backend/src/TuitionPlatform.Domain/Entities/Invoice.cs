using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

/// <summary>
/// One month of one placement. This is where the platform's margin is actually realised —
/// the parent pays AmountDue, the teacher receives TeacherPayoutAmount, the difference is
/// the commission. Amounts are snapshotted from the placement at generation time so that
/// renegotiating a fee never rewrites history.
/// </summary>
public class Invoice : AuditableEntity
{
    public Guid PlacementId { get; set; }

    public DateOnly PeriodStart { get; set; }

    public DateOnly PeriodEnd { get; set; }

    public decimal AmountDue { get; set; }

    public decimal CommissionAmount { get; set; }

    public decimal TeacherPayoutAmount { get; set; }

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Pending;

    /// <summary>When the parent's payment to the platform was confirmed.</summary>
    public DateTime? PaidAtUtc { get; set; }

    public string? ReferenceNumber { get; set; }

    /// <summary>When the platform forwarded the teacher's share — separate from PaidAtUtc
    /// because collecting from the parent and paying the teacher are two distinct events.</summary>
    public DateTime? TeacherPaidOutAtUtc { get; set; }

    public Placement Placement { get; set; } = default!;
}
