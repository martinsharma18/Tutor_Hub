using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class LookupItemConfiguration : IEntityTypeConfiguration<LookupItem>
{
    public void Configure(EntityTypeBuilder<LookupItem> builder)
    {
        builder.Property(l => l.Category).HasMaxLength(60);
        builder.Property(l => l.Code).HasMaxLength(60);
        builder.Property(l => l.Label).HasMaxLength(200);

        // A category can't have the same code twice (e.g. two "Male" entries under Gender).
        builder.HasIndex(l => new { l.Category, l.Code }).IsUnique();
    }
}
