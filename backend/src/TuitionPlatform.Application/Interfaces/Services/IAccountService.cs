using TuitionPlatform.Application.DTOs.Account;

namespace TuitionPlatform.Application.Interfaces.Services;

public interface IAccountService
{
    Task<AccountExportDto> ExportMyDataAsync(Guid userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Anonymizes rather than hard-deletes. Payments/applications/reviews reference the user with
    /// DeleteBehavior.Restrict and must be retained for accounting and dispute resolution, so a
    /// row delete would either fail or destroy financial history. This strips every piece of
    /// personal data and permanently disables sign-in, which is the meaningful outcome.
    /// </summary>
    Task DeleteMyAccountAsync(Guid userId, CancellationToken cancellationToken = default);
}
