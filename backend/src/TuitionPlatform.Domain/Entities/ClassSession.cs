using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

/// <summary>
/// One scheduled class within a placement. For online tuition this is where the platform keeps
/// control — the meeting link and attendance live here, so neither side needs to arrange the
/// class privately.
/// </summary>
public class ClassSession : AuditableEntity
{
    public Guid PlacementId { get; set; }

    public DateTime ScheduledAtUtc { get; set; }

    public int DurationMinutes { get; set; } = 60;

    /// <summary>Overrides Placement.MeetingLink for this session only (e.g. a one-off room).</summary>
    public string? MeetingLink { get; set; }

    public ClassSessionStatus Status { get; set; } = ClassSessionStatus.Scheduled;

    public string? TeacherNotes { get; set; }

    public Placement Placement { get; set; } = default!;
}
