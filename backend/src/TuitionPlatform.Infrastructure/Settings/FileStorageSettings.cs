namespace TuitionPlatform.Infrastructure.Settings;

public class FileStorageSettings
{
    public const string SectionName = "FileStorage";

    /// <summary>Disk path files are written to. Defaults to wwwroot/uploads under the API's content root.</summary>
    public string LocalPath { get; set; } = "wwwroot/uploads";

    /// <summary>URL prefix files are served from — must match the static file mapping in Program.cs.</summary>
    public string UrlPrefix { get; set; } = "/uploads";

    public long MaxFileSizeBytes { get; set; } = 5 * 1024 * 1024; // 5MB, matches the existing frontend CV-size check
}
