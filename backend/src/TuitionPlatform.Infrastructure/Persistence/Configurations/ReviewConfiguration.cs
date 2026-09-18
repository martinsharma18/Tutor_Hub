using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.Property(r => r.Comment).HasMaxLength(1000);

        builder.HasOne(r => r.ReviewerUser)
            .WithMany()
            .HasForeignKey(r => r.ReviewerUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.TeacherProfile)
            .WithMany()
            .HasForeignKey(r => r.TeacherProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.TuitionPost)
            .WithMany()
            .HasForeignKey(r => r.TuitionPostId)
            .OnDelete(DeleteBehavior.Restrict);

        // One review per (reviewer, post) — a parent reviews the hired teacher for that vacancy once.
        builder.HasIndex(r => new { r.ReviewerUserId, r.TuitionPostId }).IsUnique();
        builder.HasIndex(r => r.TeacherProfileId);
    }
}
