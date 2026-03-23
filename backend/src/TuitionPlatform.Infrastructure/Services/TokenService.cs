using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TuitionPlatform.Application.Interfaces.Persistence;
using TuitionPlatform.Application.Interfaces.Services;
using TuitionPlatform.Domain.Entities;
using TuitionPlatform.Infrastructure.Settings;

namespace TuitionPlatform.Infrastructure.Services;

public class TokenService : ITokenService
{
    private readonly JwtSettings _settings;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;

    public TokenService(
        IOptions<JwtSettings> options,
        IRefreshTokenRepository refreshTokenRepository,
        IUnitOfWork unitOfWork)
    {
        _settings = options.Value;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
    }

    public (string AccessToken, DateTime ExpiresAtUtc) CreateAccessToken(User user)
    {
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, user.Role.ToString()),
            new("fullName", user.FullName)
        };

        var token = new JwtSecurityToken(
            _settings.Issuer,
            _settings.Audience,
            claims,
            expires: expires,
            signingCredentials: credentials);

        var tokenHandler = new JwtSecurityTokenHandler();
        var accessToken = tokenHandler.WriteToken(token);
        return (accessToken, expires);
    }

    public async Task<string> CreateRefreshTokenAsync(User user, CancellationToken cancellationToken = default)
    {
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = Guid.NewGuid().ToString("N"),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(_settings.RefreshTokenDays),
            IsRevoked = false
        };

        await _refreshTokenRepository.AddAsync(refreshToken, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return refreshToken.Token;
    }

    public Task<RefreshToken?> ValidateRefreshTokenAsync(User user, string refreshToken, CancellationToken cancellationToken = default)
        => _refreshTokenRepository.GetValidTokenAsync(user.Id, refreshToken, cancellationToken);
}

