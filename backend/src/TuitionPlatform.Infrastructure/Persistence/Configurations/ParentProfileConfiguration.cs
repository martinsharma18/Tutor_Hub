using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class ParentProfileConfiguration : IEntityTypeConfiguration<ParentProfile>
{
    public void Configure(EntityTypeBuilder<ParentProfile> builder)
    {
        builder.Property(p => p.City).HasMaxLength(120);
        builder.Property(p => p.Area).HasMaxLength(120);

        builder.HasMany(p => p.TuitionPosts)
            .WithOne(t => t.ParentProfile)
            .HasForeignKey(t => t.ParentProfileId);
    }
}

