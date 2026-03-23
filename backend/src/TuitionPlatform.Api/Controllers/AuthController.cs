using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Application.DTOs.Auth;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("parent/register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> RegisterParent(RegisterParentRequest request, CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterParentAsync(request, cancellationToken);
        return Ok(response);
    }

    [HttpPost("teacher/register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> RegisterTeacher(RegisterTeacherRequest request, CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterTeacherAsync(request, cancellationToken);
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
}

