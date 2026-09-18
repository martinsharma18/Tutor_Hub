using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class TuitionPostConfiguration : IEntityTypeConfiguration<TuitionPost>
{
    public void Configure(EntityTypeBuilder<TuitionPost> builder)
    {
        builder.Property(p => p.Subject).HasMaxLength(200);
        builder.Property(p => p.ClassLevel).HasMaxLength(120);
        builder.Property(p => p.City).HasMaxLength(120);
        builder.Property(p => p.Area).HasMaxLength(120);
        builder.Property(p => p.Schedule).HasMaxLength(500);
        builder.Property(p => p.Budget).HasColumnType("decimal(18,2)");
        builder.Property(p => p.CommissionAmount).HasColumnType("decimal(18,2)");
        builder.Property(p => p.ParentPhoneNumber).HasMaxLength(20);

        builder.HasMany(p => p.Applications)
            .WithOne(a => a.TuitionPost)
            .HasForeignKey(a => a.TuitionPostId);

        // CreatedByUserId is a plain Guid (no HasOne/HasMany to User configured), so it never got
        // an FK-convention index despite being the filter for every "my posts" query. Status and
        // CreatedAtUtc back GetOpenPostsAsync's filter+sort and every other paged listing here.
        builder.HasIndex(p => p.CreatedByUserId);
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.CreatedAtUtc);
    }
}

