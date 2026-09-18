namespace TuitionPlatform.Application.Interfaces.Services;

public class FileUploadResult
{
    public required string Url { get; init; }
}

public interface IFileStorageService
{
    /// <summary>
    /// Validates and stores an uploaded file, returning the URL clients should use to fetch it.
    /// Throws BadRequestException for a disallowed content type or an over-size file.
    /// </summary>
    Task<FileUploadResult> SaveAsync(Stream content, string fileName, string contentType, long lengthBytes, CancellationToken cancellationToken = default);
}
