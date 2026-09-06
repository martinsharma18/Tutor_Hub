using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

public class ParentProfile : AuditableEntity
{
    public Guid UserId { get; set; }

    public string City { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public User User { get; set; } = default!;

    // No TuitionPosts/DemoRequests collections here: those link to the parent via
    // User.Id (CreatedByUserId / ParentId), not ParentProfile.Id — see TuitionPost/DemoRequest.
}

