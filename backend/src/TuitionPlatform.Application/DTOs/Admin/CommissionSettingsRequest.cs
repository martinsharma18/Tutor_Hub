namespace TuitionPlatform.Application.DTOs.Admin;

public class CommissionSettingsRequest
{
    public decimal CommissionPercentage { get; set; }
    public decimal? FlatCommissionAmount { get; set; }
    public string PaymentInstructions { get; set; } = string.Empty;
    public bool AutoApproveTeachers { get; set; }
    public bool AutoApproveParentPosts { get; set; }
}

