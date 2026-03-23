using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

public class TeacherApplication : AuditableEntity
{
    public Guid TeacherProfileId { get; set; }

    public Guid TuitionPostId { get; set; }

    public string Message { get; set; } = string.Empty;

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    public DateTime? ShortlistedAtUtc { get; set; }

    public DateTime? HiredAtUtc { get; set; }

    public TeacherProfile TeacherProfile { get; set; } = default!;

    public TuitionPost TuitionPost { get; set; } = default!;
}

