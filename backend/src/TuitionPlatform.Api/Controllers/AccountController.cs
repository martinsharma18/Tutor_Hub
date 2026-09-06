using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuitionPlatform.Api.Extensions;
using TuitionPlatform.Application.DTOs.Account;
using TuitionPlatform.Application.Interfaces.Services;

namespace TuitionPlatform.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet("export")]
    public async Task<ActionResult<AccountExportDto>> Export(CancellationToken cancellationToken)
    {
        var result = await _accountService.ExportMyDataAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteAccount(CancellationToken cancellationToken)
    {
        await _accountService.DeleteMyAccountAsync(User.GetUserId(), cancellationToken);
        return NoContent();
    }
}
