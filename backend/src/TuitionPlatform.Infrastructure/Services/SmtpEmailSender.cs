using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Infrastructure.Settings;

namespace TuitionPlatform.Infrastructure.Services;

/// <summary>
/// SMTP-backed email sender. No real mail provider is configured for this project — Smtp:Host is
/// empty by default, in which case this logs and returns instead of throwing, so every caller
/// (notifications, password reset) works today and starts actually sending mail the moment real
/// SMTP credentials are added to configuration. Never hardcode credentials here.
/// </summary>
public class SmtpEmailSender : IEmailSender
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IOptions<SmtpSettings> settings, ILogger<SmtpEmailSender> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(string toEmail, string subject, string body, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.Host) || string.IsNullOrWhiteSpace(_settings.FromAddress))
        {
            _logger.LogInformation("Email not sent (SMTP not configured): to={To}, subject={Subject}", toEmail, subject);
            return;
        }

        using var message = new MailMessage
        {
            From = new MailAddress(_settings.FromAddress, _settings.FromName),
            Subject = subject,
            Body = body,
            IsBodyHtml = false,
        };
        message.To.Add(toEmail);

        using var client = new SmtpClient(_settings.Host, _settings.Port)
        {
            EnableSsl = _settings.EnableSsl,
            Credentials = string.IsNullOrWhiteSpace(_settings.Username)
                ? null
                : new NetworkCredential(_settings.Username, _settings.Password),
        };

        try
        {
            await client.SendMailAsync(message, cancellationToken);
        }
        catch (Exception ex)
        {
            // Email is a best-effort side channel — a delivery failure must never fail the
            // request that triggered it (e.g. registering, hiring a teacher).
            _logger.LogWarning(ex, "Failed to send email to {To}", toEmail);
        }
    }
}
