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
    public DbSet<ParentProfile> ParentProfiles => Set<ParentProfile>();
    public DbSet<TuitionPost> TuitionPosts => Set<TuitionPost>();
    public DbSet<TeacherApplication> TeacherApplications => Set<TeacherApplication>();
    public DbSet<DemoRequest> DemoRequests => Set<DemoRequest>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<AdminSettings> AdminSettings => Set<AdminSettings>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<VerificationToken> VerificationTokens => Set<VerificationToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<LookupItem> LookupItems => Set<LookupItem>();
    public DbSet<Placement> Placements => Set<Placement>();
    public DbSet<ClassSession> ClassSessions => Set<ClassSession>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<PlacementFeedback> PlacementFeedback => Set<PlacementFeedback>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new TeacherProfileConfiguration());
        modelBuilder.ApplyConfiguration(new ParentProfileConfiguration());
        modelBuilder.ApplyConfiguration(new TuitionPostConfiguration());
        modelBuilder.ApplyConfiguration(new TeacherApplicationConfiguration());
        modelBuilder.ApplyConfiguration(new DemoRequestConfiguration());
        modelBuilder.ApplyConfiguration(new PaymentConfiguration());
        modelBuilder.ApplyConfiguration(new MessageConfiguration());
        modelBuilder.ApplyConfiguration(new AdminSettingsConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());
        modelBuilder.ApplyConfiguration(new ReviewConfiguration());
        modelBuilder.ApplyConfiguration(new NotificationConfiguration());
        modelBuilder.ApplyConfiguration(new VerificationTokenConfiguration());
        modelBuilder.ApplyConfiguration(new AuditLogConfiguration());
        modelBuilder.ApplyConfiguration(new LookupItemConfiguration());
        modelBuilder.ApplyConfiguration(new PlacementConfiguration());
        modelBuilder.ApplyConfiguration(new ClassSessionConfiguration());
        modelBuilder.ApplyConfiguration(new InvoiceConfiguration());
        modelBuilder.ApplyConfiguration(new PlacementFeedbackConfiguration());
    }
}
