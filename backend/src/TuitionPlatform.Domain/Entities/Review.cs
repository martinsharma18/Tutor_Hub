using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

public class Review : AuditableEntity
{
    public Guid ReviewerUserId { get; set; }

    public Guid TeacherProfileId { get; set; }

    public Guid TuitionPostId { get; set; }

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public User ReviewerUser { get; set; } = default!;

    public TeacherProfile TeacherProfile { get; set; } = default!;

    public TuitionPost TuitionPost { get; set; } = default!;
}
