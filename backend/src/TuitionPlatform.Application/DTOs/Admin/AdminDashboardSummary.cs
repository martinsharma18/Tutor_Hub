namespace TuitionPlatform.Application.DTOs.Admin;

public class AdminDashboardSummary
{
    public int TotalUsers { get; set; }
    public int TotalTeachers { get; set; }
    public int AvailableVacancies { get; set; }
    public int ClosedVacancies { get; set; }
    public decimal TotalCommissionEarned { get; set; }
    public int PendingPayments { get; set; }
}
