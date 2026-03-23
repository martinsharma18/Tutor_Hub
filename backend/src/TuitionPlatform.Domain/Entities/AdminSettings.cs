using TuitionPlatform.Domain.Common;

namespace TuitionPlatform.Domain.Entities;

public class AdminSettings : BaseEntity
{
    public decimal CommissionPercentage { get; set; } = 10m;

    public decimal? FlatCommissionAmount { get; set; }

    public string PaymentInstructions { get; set; } = "Send payment to admin account";

    public bool AutoApproveTeachers { get; set; }

    public bool AutoApproveParentPosts { get; set; }
}

