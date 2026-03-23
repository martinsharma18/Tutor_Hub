using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class TeacherApplicationConfiguration : IEntityTypeConfiguration<TeacherApplication>
{
    public void Configure(EntityTypeBuilder<TeacherApplication> builder)
    {
        builder.Property(a => a.Message).HasMaxLength(2000);
    }
}

