using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(p => p.Amount).HasColumnType("decimal(18,2)");
        builder.Property(p => p.CommissionAmount).HasColumnType("decimal(18,2)");
        builder.Property(p => p.TeacherNetAmount).HasColumnType("decimal(18,2)");

        builder.HasOne(p => p.Parent)
            .WithMany()
            .HasForeignKey(p => p.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Teacher)
            .WithMany()
            .HasForeignKey(p => p.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

