using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class TeacherProfileConfiguration : IEntityTypeConfiguration<TeacherProfile>
{
    public void Configure(EntityTypeBuilder<TeacherProfile> builder)
    {
        builder.Property(t => t.City).HasMaxLength(120);
        builder.Property(t => t.Area).HasMaxLength(120);
        builder.Property(t => t.Subjects).HasMaxLength(1000);
        builder.Property(t => t.Classes).HasMaxLength(500);
        builder.Property(t => t.Bio).HasMaxLength(2000);
        builder.Property(t => t.ExperienceSummary).HasMaxLength(2000);
        builder.Property(t => t.HourlyRate).HasColumnType("decimal(18,2)");

        builder.HasMany(t => t.Applications)
            .WithOne(a => a.TeacherProfile)
            .HasForeignKey(a => a.TeacherProfileId);
    }
}

