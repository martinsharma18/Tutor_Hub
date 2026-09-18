namespace TuitionPlatform.Application.DTOs.Placements;

public class PlacementDto
{
    public Guid Id { get; set; }
    public Guid ParentUserId { get; set; }
    public string ParentName { get; set; } = string.Empty;
    public Guid TeacherProfileId { get; set; }
    public Guid TeacherUserId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public Guid? TuitionPostId { get; set; }

    public string Subject { get; set; } = string.Empty;
    public string ClassLevel { get; set; } = string.Empty;
    public string Mode { get; set; } = string.Empty;
    public string Schedule { get; set; } = string.Empty;
    public string? MeetingLink { get; set; }

    /// <summary>What the parent pays. Null when the viewer is a teacher on an online placement —
    /// see PlacementVisibility for why that differs by mode.</summary>
    public decimal? MonthlyFee { get; set; }

    /// <summary>Platform's cut. Hidden from the teacher on online placements.</summary>
    public decimal? CommissionAmount { get; set; }

    /// <summary>Always visible to the teacher — it's their own money.</summary>
    public decimal TeacherPayoutAmount { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? EndReason { get; set; }
    public string? EndNotes { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreatePlacementRequest
{
    /// <summary>Optional: creating from a hired application pre-fills parent/teacher/subject.</summary>
    public Guid? TeacherApplicationId { get; set; }

    public Guid ParentUserId { get; set; }
    public Guid TeacherProfileId { get; set; }
    public Guid? TuitionPostId { get; set; }

    public string Subject { get; set; } = string.Empty;
    public string ClassLevel { get; set; } = string.Empty;
    public string Mode { get; set; } = string.Empty;
    public string Schedule { get; set; } = string.Empty;
    public string? MeetingLink { get; set; }

    public decimal MonthlyFee { get; set; }

    /// <summary>Leave null to use the platform default from AdminSettings (flat amount if one is
    /// configured, otherwise the percentage). Set it to override for this placement only.</summary>
    public decimal? CommissionAmount { get; set; }

    public DateOnly StartDate { get; set; }
}

public class UpdatePlacementRequest
{
    public string? Schedule { get; set; }
    public string? MeetingLink { get; set; }
    public decimal? MonthlyFee { get; set; }
    public decimal? CommissionAmount { get; set; }
}

public class EndPlacementRequest
{
    public string EndReason { get; set; } = string.Empty;
    public string? EndNotes { get; set; }
}

public class InvoiceDto
{
    public Guid Id { get; set; }
    public Guid PlacementId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string ParentName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public DateOnly PeriodStart { get; set; }
    public DateOnly PeriodEnd { get; set; }

    public decimal? AmountDue { get; set; }
    public decimal? CommissionAmount { get; set; }
    public decimal TeacherPayoutAmount { get; set; }

    public string Status { get; set; } = string.Empty;
    public DateTime? PaidAtUtc { get; set; }
    public string? ReferenceNumber { get; set; }
    public DateTime? TeacherPaidOutAtUtc { get; set; }
}

public class MarkInvoicePaidRequest
{
    public string? ReferenceNumber { get; set; }
}

public class PlacementFeedbackDto
{
    public Guid Id { get; set; }
    public Guid PlacementId { get; set; }
    public string CollectedByName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Notes { get; set; } = string.Empty;
    public bool IsAtRisk { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreatePlacementFeedbackRequest
{
    public int Rating { get; set; }
    public string Notes { get; set; } = string.Empty;
    public bool IsAtRisk { get; set; }
}
