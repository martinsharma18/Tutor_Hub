using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/files")]
public class FilesController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;

    public FilesController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)] // hard cap above IFileStorageService's own 5MB check
    public async Task<ActionResult<FileUploadResult>> Upload(IFormFile file, CancellationToken cancellationToken)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "No file was provided." });
        }

        await using var stream = file.OpenReadStream();
        var result = await _fileStorageService.SaveAsync(stream, file.FileName, file.ContentType, file.Length, cancellationToken);
        return Ok(result);
    }
}
