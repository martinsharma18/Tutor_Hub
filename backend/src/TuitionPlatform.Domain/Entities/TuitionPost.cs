using TuitionPlatform.Domain.Common;
using TuitionPlatform.Domain.Enums;

namespace TuitionPlatform.Domain.Entities;

public class TuitionPost : AuditableEntity
{
    public Guid CreatedByUserId { get; set; }

    public Guid? ParentProfileId { get; set; }

    public string Subject { get; set; } = string.Empty;

    public string ClassLevel { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public TeachingMode Mode { get; set; }

    public decimal Budget { get; set; }

    public string Schedule { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TuitionPostStatus Status { get; set; } = TuitionPostStatus.Pending;

    public Guid? ApprovedByUserId { get; set; }

    public DateTime? ApprovedAtUtc { get; set; }

    public ParentProfile? ParentProfile { get; set; }

    public ICollection<TeacherApplication> Applications { get; set; } = new List<TeacherApplication>();

    public ICollection<DemoRequest> DemoRequests { get; set; } = new List<DemoRequest>();
}

