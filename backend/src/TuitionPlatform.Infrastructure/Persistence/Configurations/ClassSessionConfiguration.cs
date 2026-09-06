using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class ClassSessionConfiguration : IEntityTypeConfiguration<ClassSession>
{
    public void Configure(EntityTypeBuilder<ClassSession> builder)
    {
        builder.Property(s => s.MeetingLink).HasMaxLength(500);
        builder.Property(s => s.TeacherNotes).HasMaxLength(1000);

        // Upcoming-classes lookups filter by placement and order by time.
        builder.HasIndex(s => new { s.PlacementId, s.ScheduledAtUtc });
        builder.HasIndex(s => s.ScheduledAtUtc);
    }
}
