using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TuitionPlatform.Infrastructure.Persistence;

/// <summary>
/// Used only at design time (dotnet ef migrations / database update).
/// EF Core discovers this class automatically — no DI setup needed.
/// </summary>
public class TuitionPlatformDbContextFactory : IDesignTimeDbContextFactory<TuitionPlatformDbContext>
{
    public TuitionPlatformDbContext CreateDbContext(string[] args)
    {
        // Walk up to the API project to read its appsettings.json
        var basePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "..", "TuitionPlatform.Api");

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Configure ConnectionStrings__DefaultConnection with your PostgreSQL connection string before running EF Core commands.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<TuitionPlatformDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new TuitionPlatformDbContext(optionsBuilder.Options);
    }
}
