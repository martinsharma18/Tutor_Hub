using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using TuitionPlatform.Application.Common.Exceptions;

namespace TuitionPlatform.Api.Filters;

public class ApiExceptionFilter : IExceptionFilter
{
    private readonly ILogger<ApiExceptionFilter> _logger;

    public ApiExceptionFilter(ILogger<ApiExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        var error = context.Exception switch
        {
            ValidationException validationException => HandleValidationException(validationException),
            NotFoundException notFound => CreateProblem(StatusCodes.Status404NotFound, notFound.Message, notFound.Code),
            ForbiddenException forbidden => CreateProblem(StatusCodes.Status403Forbidden, forbidden.Message, forbidden.Code),
            // BadRequestException was missing here, so every deliberate 400 (invalid role, expired
            // password-reset token, rejected file upload) surfaced as a generic 500 and the caller
            // never saw the actual reason.
            BadRequestException badRequest => CreateProblem(StatusCodes.Status400BadRequest, badRequest.Message, badRequest.Code),
            _ => CreateProblem(StatusCodes.Status500InternalServerError, "An unexpected error occurred.", "server_error")
        };

        // Correlation id lets a user-reported error be traced to the exact log entry — the
        // response carries it, and it's attached to the log line for the same request.
        var traceId = context.HttpContext.TraceIdentifier;
        error.Extensions["traceId"] = traceId;

        // Expected, user-caused outcomes (validation/404/403/400) are noise at Error level —
        // only genuinely unexpected failures should page anyone.
        if (context.Exception is AppException)
        {
            _logger.LogInformation("Handled {ExceptionType} on {Path} (traceId {TraceId}): {Message}",
                context.Exception.GetType().Name, context.HttpContext.Request.Path, traceId, context.Exception.Message);
        }
        else
        {
            _logger.LogError(context.Exception, "Unhandled exception on {Path} (traceId {TraceId})",
                context.HttpContext.Request.Path, traceId);
        }

        context.Result = new ObjectResult(error) { StatusCode = error.Status };
        context.ExceptionHandled = true;
    }

    private static ProblemDetails CreateProblem(int status, string message, string code) =>
        new()
        {
            Title = message,
            Detail = message,
            Status = status,
            Extensions = { ["code"] = code }
        };

    private static ValidationProblemDetails HandleValidationException(ValidationException ex)
        => new(ex.Errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation failure",
            Extensions = { ["code"] = ex.Code }
        };
}

