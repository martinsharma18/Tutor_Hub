using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

/// <summary>
/// An admin's check-in with the parent about a live placement. Distinct from Review: a Review is
/// public and written once by the parent, this is internal, recurring, and exists so problems
/// surface before the parent quietly cancels. It's the part a plain listings site can't copy.
/// </summary>
public class PlacementFeedback : AuditableEntity
{
    public Guid PlacementId { get; set; }

    public Guid CollectedByAdminUserId { get; set; }

    public int Rating { get; set; }

    public string Notes { get; set; } = string.Empty;

    /// <summary>Set by the admin when the parent sounds likely to stop — drives a follow-up queue.</summary>
    public bool IsAtRisk { get; set; }

    public Placement Placement { get; set; } = default!;

    public User CollectedByAdminUser { get; set; } = default!;
}
