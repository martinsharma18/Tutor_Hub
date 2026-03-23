using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Interfaces.Persistence;

public interface IAdminSettingsRepository : IGenericRepository<AdminSettings>
{
    Task<AdminSettings> GetSettingsAsync(CancellationToken cancellationToken = default);
}

