using Microsoft.Extensions.Options;
using TuitionPlatform.Application.Common.Exceptions;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Infrastructure.Settings;

namespace TuitionPlatform.Infrastructure.Services;

/// <summary>
/// Writes uploads to local disk under wwwroot, served back out by app.UseStaticFiles() in
/// Program.cs. This is a placeholder for a real deployment: Render's filesystem is ephemeral, so
/// anything saved here is lost on every redeploy/restart. Swap in an Azure Blob Storage or
/// S3-compatible IFileStorageService implementation once those credentials exist — no other code
/// needs to change, callers only depend on this interface.
/// </summary>
public class LocalFileStorageService : IFileStorageService
{
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp",
        "application/pdf", "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };

    private static readonly Dictionary<string, string> ExtensionByContentType = new(StringComparer.OrdinalIgnoreCase)
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp",
        ["application/pdf"] = ".pdf",
        ["application/msword"] = ".doc",
        ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = ".docx"
    };

    private readonly FileStorageSettings _settings;

    public LocalFileStorageService(IOptions<FileStorageSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task<FileUploadResult> SaveAsync(Stream content, string fileName, string contentType, long lengthBytes, CancellationToken cancellationToken = default)
    {
        // Validated against the client-supplied Content-Type header only — a malicious client can
        // lie about this. Good enough to stop accidental wrong-file uploads; a real deployment
        // should also sniff the file's magic bytes before trusting the extension it's served under.
        if (!AllowedContentTypes.Contains(contentType))
        {
            throw new BadRequestException("Only JPEG/PNG/WebP images or PDF/Word documents are accepted.");
        }

        if (lengthBytes > _settings.MaxFileSizeBytes)
        {
            throw new BadRequestException($"File exceeds the {_settings.MaxFileSizeBytes / 1024 / 1024}MB limit.");
        }

        Directory.CreateDirectory(_settings.LocalPath);

        var extension = ExtensionByContentType[contentType];
        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(_settings.LocalPath, storedFileName);

        await using (var fileStream = File.Create(fullPath))
        {
            await content.CopyToAsync(fileStream, cancellationToken);
        }

        return new FileUploadResult { Url = $"{_settings.UrlPrefix}/{storedFileName}" };
    }
}
