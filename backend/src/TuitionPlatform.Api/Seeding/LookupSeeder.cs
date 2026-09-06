using Microsoft.EntityFrameworkCore;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Infrastructure.Persistence;

namespace TuitionPlatform.Api.Seeding;

/// <summary>
/// Seeds the dropdown options that were previously hardcoded as &lt;option&gt; tags across five
/// frontend files. Values are copied VERBATIM from those files so switching the UI over to the
/// API changes nothing a user sees — see LookupItem for why Subject/City are deliberately excluded.
/// Idempotent: only inserts codes that don't already exist, so admin edits are never overwritten.
/// </summary>
public static class LookupSeeder
{
    // Codes match what's already persisted on existing records (TeacherProfile.Gender,
    // .Qualification, .PreferredMode), so seeding does not orphan any current row.
    private static readonly (string Category, string Code, string Label, int SortOrder)[] Defaults =
    {
        ("TeachingMode", "Online", "Online", 1),
        ("TeachingMode", "Offline", "Offline", 2),
        ("TeachingMode", "Hybrid", "Hybrid", 3),

        ("Gender", "Male", "Male", 1),
        ("Gender", "Female", "Female", 2),
        ("Gender", "Other", "Other", 3),
        ("Gender", "PreferNotToSay", "Prefer not to say", 4),

        ("Qualification", "SLC/SEE", "SLC / SEE", 1),
        ("Qualification", "+2/Intermediate", "+2 / Intermediate", 2),
        ("Qualification", "Bachelor", "Bachelor's Degree", 3),
        ("Qualification", "Master", "Master's Degree", 4),
        ("Qualification", "MPhil", "MPhil", 5),
        ("Qualification", "PhD", "PhD", 6),
        ("Qualification", "Diploma", "Diploma / Certificate", 7),
    };

    public static async Task SeedAsync(IServiceProvider services, ILogger logger, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TuitionPlatformDbContext>();

        var existing = await dbContext.LookupItems
            .Select(l => new { l.Category, l.Code })
            .ToListAsync(cancellationToken);

        var existingKeys = existing.Select(e => $"{e.Category}|{e.Code}").ToHashSet();

        var toInsert = Defaults
            .Where(d => !existingKeys.Contains($"{d.Category}|{d.Code}"))
            .Select(d => new LookupItem
            {
                Category = d.Category,
                Code = d.Code,
                Label = d.Label,
                SortOrder = d.SortOrder,
                IsActive = true
            })
            .ToList();

        if (toInsert.Count == 0)
        {
            return;
        }

        dbContext.LookupItems.AddRange(toInsert);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded {Count} lookup items.", toInsert.Count);
    }
}
