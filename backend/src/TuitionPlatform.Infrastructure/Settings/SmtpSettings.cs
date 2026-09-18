namespace TuitionPlatform.Infrastructure.Settings;

public class SmtpSettings
{
    public const string SectionName = "Smtp";

    public string? Host { get; set; }
    public int Port { get; set; } = 587;
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? FromAddress { get; set; }
    public string FromName { get; set; } = "Best Tuitions";
    public bool EnableSsl { get; set; } = true;
}
