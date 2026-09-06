using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class PlacementFeedbackConfiguration : IEntityTypeConfiguration<PlacementFeedback>
{
    public void Configure(EntityTypeBuilder<PlacementFeedback> builder)
    {
        builder.Property(f => f.Notes).HasMaxLength(2000);

        builder.HasOne(f => f.CollectedByAdminUser)
            .WithMany()
            .HasForeignKey(f => f.CollectedByAdminUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Drives the "placements needing attention" queue.
        builder.HasIndex(f => f.IsAtRisk);
    }
}
