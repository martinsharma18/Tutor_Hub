using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Application.DTOs.Search;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet("teachers")]
    [AllowAnonymous]
    public async Task<ActionResult<TeacherSearchResponse>> SearchTeachers([FromQuery] TeacherSearchRequest request, CancellationToken cancellationToken)
    {
        var result = await _searchService.SearchTeachersAsync(request, cancellationToken);
        return Ok(result);
    }
}

