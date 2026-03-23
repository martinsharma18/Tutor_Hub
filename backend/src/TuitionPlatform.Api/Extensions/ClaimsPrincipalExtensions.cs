using System.Security.Claims;

namespace TuitionPlatform.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(ClaimTypes.NameIdentifier) ?? principal.Identity?.Name;
        return value is not null && Guid.TryParse(value, out var guid)
            ? guid
            : throw new InvalidOperationException("User id claim is missing.");
    }

    public static string GetRole(this ClaimsPrincipal principal)
        => principal.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
}

