using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

public class DemoRequest : AuditableEntity
{
    public Guid TeacherProfileId { get; set; }

    public Guid ParentProfileId { get; set; }

    public Guid TuitionPostId { get; set; }

    public DateOnly SelectedDate { get; set; }

    public TimeOnly SelectedTime { get; set; }

    public DemoStatus Status { get; set; } = DemoStatus.Pending;

    public string? Notes { get; set; }

    public TeacherProfile TeacherProfile { get; set; } = default!;

    public ParentProfile ParentProfile { get; set; } = default!;

    public TuitionPost TuitionPost { get; set; } = default!;
}

