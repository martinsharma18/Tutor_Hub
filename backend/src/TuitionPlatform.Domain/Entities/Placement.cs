using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

/// <summary>
/// An ongoing tuition arrangement managed by the platform — the thing the business actually
/// operates, as opposed to TuitionPost (a request) or TeacherApplication (an expression of
/// interest). Money, scheduling, and feedback all hang off this.
/// </summary>
public class Placement : AuditableEntity
{
    public Guid ParentUserId { get; set; }

    public Guid TeacherProfileId { get; set; }

    /// <summary>The vacancy this came from, if any — admin can also create a placement directly.</summary>
    public Guid? TuitionPostId { get; set; }

    public string Subject { get; set; } = string.Empty;

    public string ClassLevel { get; set; } = string.Empty;

    public TeachingMode Mode { get; set; }

    /// <summary>What the parent is billed each month.</summary>
    public decimal MonthlyFee { get; set; }

    /// <summary>The platform's cut of MonthlyFee. Snapshotted per placement so a later change to
    /// the global commission rate doesn't silently rewrite the terms of existing arrangements.</summary>
    public decimal CommissionAmount { get; set; }

    /// <summary>MonthlyFee - CommissionAmount. Stored rather than computed so historical payouts
    /// stay correct even if the fee is renegotiated later.</summary>
    public decimal TeacherPayoutAmount { get; set; }

    public string Schedule { get; set; } = string.Empty;

    /// <summary>Recurring meeting link for online placements; a session can override it.</summary>
    public string? MeetingLink { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public PlacementStatus Status { get; set; } = PlacementStatus.Active;

    public PlacementEndReason? EndReason { get; set; }

    public string? EndNotes { get; set; }

    public User ParentUser { get; set; } = default!;

    public TeacherProfile TeacherProfile { get; set; } = default!;

    public ICollection<ClassSession> Sessions { get; set; } = new List<ClassSession>();

    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public ICollection<PlacementFeedback> Feedback { get; set; } = new List<PlacementFeedback>();
}
