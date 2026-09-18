using TuitionPlatform.Application.DTOs.Metadata;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface ILookupService
{
    /// <summary>All active lookup items across every category, grouped by Category. Cached — see LookupService.</summary>
    Task<Dictionary<string, List<LookupItemDto>>> GetMetadataAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyCollection<LookupItemDto>> GetByCategoryAsync(string category, bool includeInactive, CancellationToken cancellationToken = default);

    Task<LookupItemDto> CreateAsync(CreateLookupItemRequest request, CancellationToken cancellationToken = default);

    Task<LookupItemDto> UpdateAsync(Guid id, UpdateLookupItemRequest request, CancellationToken cancellationToken = default);

    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
