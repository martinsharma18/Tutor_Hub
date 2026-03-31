using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Infrastructure.Persistence.Configurations;

namespace TuitionPlatform.Infrastructure.Persistence;

public class TuitionPlatformDbContext : DbContext, IUnitOfWork
{
    public TuitionPlatformDbContext(DbContextOptions<TuitionPlatformDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<TeacherProfile> TeacherProfiles => Set<TeacherProfile>();
    public DbSet<TuitionPost> TuitionPosts => Set<TuitionPost>();
    public DbSet<TeacherApplication> TeacherApplications => Set<TeacherApplication>();
    public DbSet<DemoRequest> DemoRequests => Set<DemoRequest>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<AdminSettings> AdminSettings => Set<AdminSettings>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new TeacherProfileConfiguration());
        modelBuilder.ApplyConfiguration(new TuitionPostConfiguration());
        modelBuilder.ApplyConfiguration(new TeacherApplicationConfiguration());
        modelBuilder.ApplyConfiguration(new DemoRequestConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentConfiguration());
        modelBuilder.ApplyConfiguration(new MessageConfiguration());
        modelBuilder.ApplyConfiguration(new AdminSettingsConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
    }
}
