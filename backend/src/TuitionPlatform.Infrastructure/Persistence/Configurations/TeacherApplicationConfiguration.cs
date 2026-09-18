using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class TeacherApplicationConfiguration : IEntityTypeConfiguration<TeacherApplication>
{
    public void Configure(EntityTypeBuilder<TeacherApplication> builder)
    {
        builder.Property(a => a.Message).HasMaxLength(2000);

        // TeacherProfileId/TuitionPostId are already indexed via their FK relationships
        // (configured in TeacherProfileConfiguration/TuitionPostConfiguration); Status is a plain
        // enum column filtered by the applicant-status workflow and gets nothing by default.
        builder.HasIndex(a => a.Status);
    }
}

