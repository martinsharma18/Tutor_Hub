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

        services.AddDbContext<TuitionPlatformDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<TuitionPlatformDbContext>());

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IParentProfileRepository, ParentProfileRepository>();
        services.AddScoped<ITeacherProfileRepository, TeacherProfileRepository>();
        services.AddScoped<ITuitionPostRepository, TuitionPostRepository>();
        services.AddScoped<ITeacherApplicationRepository, TeacherApplicationRepository>();
        services.AddScoped<IDemoRequestRepository, DemoRequestRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IAdminSettingsRepository, AdminSettingsRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<ITokenService, TokenService>();

        return services;
    }
}

