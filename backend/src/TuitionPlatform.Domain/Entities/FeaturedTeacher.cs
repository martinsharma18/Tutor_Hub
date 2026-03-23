using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

public class FeaturedTeacher : AuditableEntity
{
    public Guid TeacherProfileId { get; set; }

    public DateTime ExpiresAtUtc { get; set; }

    public TeacherProfile TeacherProfile { get; set; } = default!;
}

