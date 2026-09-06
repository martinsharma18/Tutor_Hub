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

        builder.HasOne(p => p.User)
            .WithOne()
            .HasForeignKey<ParentProfile>(p => p.UserId);

        builder.HasIndex(p => p.UserId).IsUnique();
    }
}
