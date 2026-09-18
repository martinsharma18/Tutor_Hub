using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class PlacementConfiguration : IEntityTypeConfiguration<Placement>
{
    public void Configure(EntityTypeBuilder<Placement> builder)
    {
        builder.Property(p => p.Subject).HasMaxLength(200);
        builder.Property(p => p.ClassLevel).HasMaxLength(120);
        builder.Property(p => p.Schedule).HasMaxLength(500);
        builder.Property(p => p.MeetingLink).HasMaxLength(500);
        builder.Property(p => p.EndNotes).HasMaxLength(1000);

        builder.Property(p => p.MonthlyFee).HasColumnType("decimal(18,2)");
        builder.Property(p => p.CommissionAmount).HasColumnType("decimal(18,2)");
        builder.Property(p => p.TeacherPayoutAmount).HasColumnType("decimal(18,2)");

        builder.HasOne(p => p.ParentUser)
            .WithMany()
            .HasForeignKey(p => p.ParentUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.TeacherProfile)
            .WithMany()
            .HasForeignKey(p => p.TeacherProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Sessions)
            .WithOne(s => s.Placement)
            .HasForeignKey(s => s.PlacementId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Invoices)
            .WithOne(i => i.Placement)
            .HasForeignKey(i => i.PlacementId)
            .OnDelete(DeleteBehavior.Restrict); // financial records outlive the placement

        builder.HasMany(p => p.Feedback)
            .WithOne(f => f.Placement)
            .HasForeignKey(f => f.PlacementId)
            .OnDelete(DeleteBehavior.Cascade);

        // "Active placements" is the admin's main working view; parent/teacher each need their own list.
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.ParentUserId);
        builder.HasIndex(p => p.TeacherProfileId);
    }
}
