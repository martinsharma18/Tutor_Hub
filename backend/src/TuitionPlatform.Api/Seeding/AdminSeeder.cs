using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Domain.Enums;
using TuitionPlatform.Infrastructure.Persistence;

namespace TuitionPlatform.Api.Seeding;

/// <summary>
/// Creates the initial admin account on first run so a fresh deployment is usable.
/// Credentials come from configuration (AdminSeed:Email / AdminSeed:Password), which
/// on Render/production are supplied as environment variables — never hardcoded here.
/// </summary>
public static class AdminSeeder
{
    public static async Task SeedAsync(IServiceProvider services, ILogger logger, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

        var email = configuration["AdminSeed:Email"];
        var password = configuration["AdminSeed:Password"];

        // Seeding is opt-in. With no credentials configured we skip silently rather than
        // inventing a default account, which would itself be a known-credentials backdoor.
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogInformation("Admin seeding skipped: AdminSeed:Email / AdminSeed:Password not configured.");
            return;
        }

        var dbContext = scope.ServiceProvider.GetRequiredService<TuitionPlatformDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        var normalizedEmail = email.Trim().ToLowerInvariant();
        var existing = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail, cancellationToken);

        if (existing is not null)
        {
            // Deliberately does NOT touch the password. The previous implementation re-hashed
            // the seed password on every startup, which silently undid any password change the
            // admin made through the UI and made the account impossible to secure.
            logger.LogInformation("Admin seeding skipped: {Email} already exists.", normalizedEmail);
            return;
        }

        dbContext.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            Email = normalizedEmail,
            FullName = configuration["AdminSeed:FullName"] ?? "System Administrator",
            PasswordHash = passwordHasher.Hash(password),
            Role = UserRole.Admin,
            IsActive = true,
            EmailVerified = true,
            CreatedAtUtc = DateTime.UtcNow
        });

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Admin user {Email} created. Change this password immediately after first login.", normalizedEmail);
    }
}
