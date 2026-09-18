using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.Property(i => i.AmountDue).HasColumnType("decimal(18,2)");
        builder.Property(i => i.CommissionAmount).HasColumnType("decimal(18,2)");
        builder.Property(i => i.TeacherPayoutAmount).HasColumnType("decimal(18,2)");
        builder.Property(i => i.ReferenceNumber).HasMaxLength(100);

        // Stops the monthly generation job from double-billing a placement for the same period
        // if it runs twice.
        builder.HasIndex(i => new { i.PlacementId, i.PeriodStart }).IsUnique();
        builder.HasIndex(i => i.Status);
    }
}
