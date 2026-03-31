using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class DemoRequestConfiguration : IEntityTypeConfiguration<DemoRequest>
{
    public void Configure(EntityTypeBuilder<DemoRequest> builder)
    {
        builder.Property(d => d.Notes).HasMaxLength(1000);

        // Fix cascade delete conflict - use Restrict to avoid multiple cascade paths
        builder.HasOne(d => d.TeacherProfile)
            .WithMany(t => t.DemoRequests)
            .HasForeignKey(d => d.TeacherProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.Parent)
            .WithMany()
            .HasForeignKey(d => d.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.TuitionPost)
            .WithMany(t => t.DemoRequests)
            .HasForeignKey(d => d.TuitionPostId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

