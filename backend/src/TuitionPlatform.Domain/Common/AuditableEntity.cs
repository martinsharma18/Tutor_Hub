namespace TuitionPlatform.Domain.Common;

public abstract class AuditableEntity : BaseEntity
{
    public Guid? CreatedBy { get; set; }

    public Guid? UpdatedBy { get; set; }

    public bool IsDeleted { get; set; }
}

