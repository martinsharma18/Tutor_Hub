namespace TuitionPlatform.Application.DTOs.Admin;

public class AdminDashboardSummary
{
    public int TotalUsers { get; set; }
    public int TotalParents { get; set; }
    public int TotalTeachers { get; set; }
    public int PendingPosts { get; set; }
    public int ApprovedPosts { get; set; }
    public decimal TotalCommissionEarned { get; set; }
    public int PendingPayments { get; set; }
}

