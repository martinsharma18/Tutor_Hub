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

        builder.HasMany(p => p.Applications)
            .WithOne(a => a.TuitionPost)
            .HasForeignKey(a => a.TuitionPostId);
    }
}

