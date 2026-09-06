using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.DTOs.Metadata;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;

namespace TuitionPlatform.Application.Services.Metadata;

public class LookupService : ILookupService
{
    private const string MetadataCacheKey = "lookup-metadata-all";

    private readonly ILookupItemRepository _lookupItemRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly IMapper _mapper;

    public LookupService(ILookupItemRepository lookupItemRepository, IUnitOfWork unitOfWork, IMemoryCache cache, IMapper mapper)
    {
        _lookupItemRepository = lookupItemRepository;
        _unitOfWork = unitOfWork;
        _cache = cache;
        _mapper = mapper;
    }

    public async Task<Dictionary<string, List<LookupItemDto>>> GetMetadataAsync(CancellationToken cancellationToken = default)
    {
        // Read on every app boot / registration form load — cache it and only pay the DB hit once
        // per admin write, not once per visitor.
        if (_cache.TryGetValue(MetadataCacheKey, out Dictionary<string, List<LookupItemDto>>? cached) && cached is not null)
        {
            return cached;
        }

        var items = await _lookupItemRepository.GetAllActiveAsync(cancellationToken);
        var grouped = items
            .GroupBy(i => i.Category)
            .ToDictionary(g => g.Key, g => g.Select(_mapper.Map<LookupItemDto>).ToList());

        _cache.Set(MetadataCacheKey, grouped, TimeSpan.FromMinutes(10));
        return grouped;
    }

    public async Task<IReadOnlyCollection<LookupItemDto>> GetByCategoryAsync(string category, bool includeInactive, CancellationToken cancellationToken = default)
    {
        var items = await _lookupItemRepository.GetByCategoryAsync(category, includeInactive, cancellationToken);
        return items.Select(_mapper.Map<LookupItemDto>).ToList();
    }

    public async Task<LookupItemDto> CreateAsync(CreateLookupItemRequest request, CancellationToken cancellationToken = default)
    {
        if (await _lookupItemRepository.CodeExistsAsync(request.Category, request.Code, null, cancellationToken))
        {
            throw new ValidationException(new Dictionary<string, string[]>
            {
                ["code"] = new[] { $"'{request.Code}' already exists in category '{request.Category}'." }
            });
        }

        var item = new LookupItem
        {
            Category = request.Category,
            Code = request.Code,
            Label = request.Label,
            SortOrder = request.SortOrder,
            IsActive = true
        };

        await _lookupItemRepository.AddAsync(item, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        InvalidateCache();

        return _mapper.Map<LookupItemDto>(item);
    }

    public async Task<LookupItemDto> UpdateAsync(Guid id, UpdateLookupItemRequest request, CancellationToken cancellationToken = default)
    {
        var item = await _lookupItemRepository.GetByIdAsync(id, cancellationToken)
                   ?? throw new NotFoundException("Lookup item", id);

        // Label/SortOrder/IsActive are freely editable. Code is deliberately not — it's the value
        // stored on owning records (e.g. TeacherProfile.Gender); renaming it would silently orphan
        // every existing row that already used the old code.
        item.Label = request.Label;
        item.SortOrder = request.SortOrder;
        item.IsActive = request.IsActive;

        _lookupItemRepository.Update(item);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        InvalidateCache();

        return _mapper.Map<LookupItemDto>(item);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _lookupItemRepository.GetByIdAsync(id, cancellationToken)
                   ?? throw new NotFoundException("Lookup item", id);

        // Soft delete: existing records that already reference this Code (e.g. a teacher with
        // Gender="Other") must keep resolving, they just stop appearing as a choice for new entries.
        item.IsActive = false;
        _lookupItemRepository.Update(item);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        InvalidateCache();
    }

    private void InvalidateCache() => _cache.Remove(MetadataCacheKey);
}
