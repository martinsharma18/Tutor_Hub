using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Application.DTOs.Metadata;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin/lookups")]
public class AdminLookupsController : ControllerBase
{
    private readonly ILookupService _lookupService;

    public AdminLookupsController(ILookupService lookupService)
    {
        _lookupService = lookupService;
    }

    [HttpGet("{category}")]
    public async Task<ActionResult<IReadOnlyCollection<LookupItemDto>>> GetByCategory(string category, CancellationToken cancellationToken)
    {
        var result = await _lookupService.GetByCategoryAsync(category, includeInactive: true, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<LookupItemDto>> Create(CreateLookupItemRequest request, CancellationToken cancellationToken)
    {
        var result = await _lookupService.CreateAsync(request, cancellationToken);
        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<LookupItemDto>> Update(Guid id, UpdateLookupItemRequest request, CancellationToken cancellationToken)
    {
        var result = await _lookupService.UpdateAsync(id, request, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        await _lookupService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
