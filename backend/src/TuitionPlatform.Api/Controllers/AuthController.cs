using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Auth;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/auth")]
[EnableRateLimiting("auth")] // throttles brute-force login/registration attempts
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("teacher/register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> RegisterTeacher(RegisterTeacherRequest request, CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterTeacherAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("parent/register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> RegisterParent(RegisterParentRequest request, CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterParentAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var response = await _authService.LoginAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Refresh(RefreshTokenRequest request, CancellationToken cancellationToken)
    {
        var response = await _authService.RefreshTokenAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult> ForgotPassword(ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        await _authService.ForgotPasswordAsync(request, cancellationToken);
        // Always the same response, whether or not the email is registered — see ForgotPasswordAsync.
        return Ok(new { message = "If that email is registered, a reset link has been sent." });
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult> ResetPassword(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        await _authService.ResetPasswordAsync(request, cancellationToken);
        return Ok(new { message = "Password reset successfully." });
    }

    [HttpPost("verify-email/request")]
    [Authorize]
    public async Task<ActionResult> RequestEmailVerification(CancellationToken cancellationToken)
    {
        await _authService.RequestEmailVerificationAsync(User.GetUserId(), cancellationToken);
        return Ok(new { message = "Verification email sent." });
    }

    [HttpPost("verify-email/confirm")]
    [AllowAnonymous]
    public async Task<ActionResult> ConfirmEmail(ConfirmEmailRequest request, CancellationToken cancellationToken)
    {
        await _authService.ConfirmEmailAsync(request, cancellationToken);
        return Ok(new { message = "Email verified." });
    }
}

