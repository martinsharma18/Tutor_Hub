using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.Email).HasMaxLength(256);
        builder.Property(u => u.FullName).HasMaxLength(200);

        builder.HasOne(u => u.ParentProfile)
            .WithOne(p => p.User)
            .HasForeignKey<ParentProfile>(p => p.UserId);

        builder.HasOne(u => u.TeacherProfile)
            .WithOne(t => t.User)
            .HasForeignKey<TeacherProfile>(t => t.UserId);
    }
}

