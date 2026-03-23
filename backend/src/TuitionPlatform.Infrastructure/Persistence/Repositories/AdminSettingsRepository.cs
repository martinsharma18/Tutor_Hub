using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Infrastructure.Persistence.Repositories;

public class AdminSettingsRepository : GenericRepository<AdminSettings>, IAdminSettingsRepository
{
    public AdminSettingsRepository(TuitionPlatformDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<AdminSettings> GetSettingsAsync(CancellationToken cancellationToken = default)
    {
        var settings = await DbContext.AdminSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings is null)
        {
            settings = new AdminSettings();
            await DbContext.AdminSettings.AddAsync(settings, cancellationToken);
            await DbContext.SaveChangesAsync(cancellationToken);
        }

        return settings;
    }
}

