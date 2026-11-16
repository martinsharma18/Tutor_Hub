using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Infrastructure.Persistence;
using TuitionPlatform.Infrastructure.Persistence.Repositories;
using TuitionPlatform.Infrastructure.Services;
using TuitionPlatform.Infrastructure.Settings;

namespace TuitionPlatform.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection(JwtSettings.SectionName));
        services.Configure<SmtpSettings>(configuration.GetSection(SmtpSettings.SectionName));
        services.Configure<FileStorageSettings>(configuration.GetSection(FileStorageSettings.SectionName));

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Configure ConnectionStrings__DefaultConnection with your PostgreSQL connection string before starting the API.");
        }
        services.AddDbContext<TuitionPlatformDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<TuitionPlatformDbContext>());

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITeacherProfileRepository, TeacherProfileRepository>();
        services.AddScoped<IParentProfileRepository, ParentProfileRepository>();
        services.AddScoped<ITuitionPostRepository, TuitionPostRepository>();
        services.AddScoped<ITeacherApplicationRepository, TeacherApplicationRepository>();
        services.AddScoped<IDemoRequestRepository, DemoRequestRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IAdminSettingsRepository, AdminSettingsRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IReviewRepository, ReviewRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IVerificationTokenRepository, VerificationTokenRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();
        services.AddScoped<ILookupItemRepository, LookupItemRepository>();
        services.AddScoped<IPlacementRepository, PlacementRepository>();
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        services.AddScoped<IClassSessionRepository, ClassSessionRepository>();
        services.AddScoped<IPlacementFeedbackRepository, PlacementFeedbackRepository>();

        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IEmailSender, SmtpEmailSender>();
        services.AddScoped<IFileStorageService, LocalFileStorageService>();

        return services;
    }
}

