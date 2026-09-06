using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Application.DTOs.Metadata;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/metadata")]
[AllowAnonymous]
public class MetadataController : ControllerBase
{
    private readonly ILookupService _lookupService;

    public MetadataController(ILookupService lookupService)
    {
        _lookupService = lookupService;
    }

    [HttpGet]
    public async Task<ActionResult<Dictionary<string, List<LookupItemDto>>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _lookupService.GetMetadataAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("{category}")]
    public async Task<ActionResult<IReadOnlyCollection<LookupItemDto>>> GetByCategory(string category, CancellationToken cancellationToken)
    {
        var result = await _lookupService.GetByCategoryAsync(category, includeInactive: false, cancellationToken);
        return Ok(result);
    }
}
