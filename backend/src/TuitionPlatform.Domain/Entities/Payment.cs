using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

public class Payment : AuditableEntity
{
    public Guid ParentId { get; set; }

    public Guid TeacherId { get; set; }

    public Guid TuitionPostId { get; set; }

    public decimal Amount { get; set; }

    public decimal CommissionAmount { get; set; }

    public decimal TeacherNetAmount { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public string? ReferenceNumber { get; set; }

    public TuitionPost TuitionPost { get; set; } = default!;

    public User Parent { get; set; } = default!;

    public User Teacher { get; set; } = default!;
}

