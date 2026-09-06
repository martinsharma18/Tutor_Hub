using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.BackgroundJobs;

/// <summary>
/// Generates the current month's invoices for every active placement.
///
/// Design note: this runs once at startup and then every 24 hours, always targeting the current
/// month. That works precisely because InvoiceService.GenerateMonthlyInvoicesAsync is idempotent
/// (unique index on PlacementId+PeriodStart plus an existence check) — so a daily re-run costs
/// nothing, and if the server happens to be down on the 1st it simply catches up the next day.
/// A cron-style "fire exactly once on the 1st" scheduler would be more fragile, not less: miss
/// the window and the month never gets billed.
///
/// Disable with InvoiceGeneration:Enabled = false (useful in dev, or while testing manually
/// through the admin "Generate this month" button).
/// </summary>
public class MonthlyInvoiceService : BackgroundService
{
    private static readonly TimeSpan Interval = TimeSpan.FromHours(24);

    private readonly IServiceProvider _services;
    private readonly IConfiguration _configuration;
    private readonly ILogger<MonthlyInvoiceService> _logger;

    public MonthlyInvoiceService(IServiceProvider services, IConfiguration configuration, ILogger<MonthlyInvoiceService> logger)
    {
        _services = services;
        _configuration = configuration;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_configuration.GetValue("InvoiceGeneration:Enabled", true))
        {
            _logger.LogInformation("Automatic invoice generation is disabled (InvoiceGeneration:Enabled=false).");
            return;
        }

        // Let the app finish starting — migrations and seeding run first.
        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            await RunOnceAsync(stoppingToken);

            try
            {
                await Task.Delay(Interval, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break; // shutting down
            }
        }
    }

    private async Task RunOnceAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = _services.CreateScope();
            var invoiceService = scope.ServiceProvider.GetRequiredService<IInvoiceService>();

            var created = await invoiceService.GenerateMonthlyInvoicesAsync(
                DateOnly.FromDateTime(DateTime.UtcNow), cancellationToken);

            // Logged even when zero, so "did the scheduler run?" is answerable from the logs.
            // A silent job is indistinguishable from a dead one.
            _logger.LogInformation("Monthly invoice run complete — {Count} invoice(s) created.", created);
        }
        catch (Exception ex)
        {
            // Never let a bad run kill the loop — next cycle retries, and generation is idempotent
            // so a partial failure can't produce duplicates.
            _logger.LogError(ex, "Monthly invoice generation failed; will retry on the next cycle.");
        }
    }
}
