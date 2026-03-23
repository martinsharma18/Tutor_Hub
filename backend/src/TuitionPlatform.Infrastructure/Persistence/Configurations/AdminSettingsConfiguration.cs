using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class AdminSettingsConfiguration : IEntityTypeConfiguration<AdminSettings>
{
    public void Configure(EntityTypeBuilder<AdminSettings> builder)
    {
        builder.Property(s => s.CommissionPercentage).HasColumnType("decimal(5,2)");
        builder.Property(s => s.FlatCommissionAmount).HasColumnType("decimal(18,2)");
    }
}

