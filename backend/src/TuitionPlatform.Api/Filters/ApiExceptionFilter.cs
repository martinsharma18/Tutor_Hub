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
            _ => CreateProblem(StatusCodes.Status500InternalServerError, "An unexpected error occurred.", "server_error")
        };

        if (context.Exception is not ValidationException)
        {
            _logger.LogError(context.Exception, "Unhandled exception");
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

