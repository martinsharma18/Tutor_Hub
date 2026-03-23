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

    public ICollection<TuitionPost> TuitionPosts { get; set; } = new List<TuitionPost>();

    public ICollection<DemoRequest> DemoRequests { get; set; } = new List<DemoRequest>();
}

