using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TuitionPlatform.Application.Common.Security;

public static class JwtTokenHelper
{
    public static ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var jwt = tokenHandler.ReadJwtToken(token);
            var identity = new ClaimsIdentity(jwt.Claims, "jwt");
            return new ClaimsPrincipal(identity);
        }
        catch
        {
            return null;
        }
    }
}

