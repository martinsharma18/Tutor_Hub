namespace TuitionPlatform.Application.Common.Exceptions;

public class ValidationException : AppException
{
    public ValidationException(IDictionary<string, string[]> errors)
        : base("Validation failed", "validation_failed")
    {
        Errors = errors;
    }

    public IDictionary<string, string[]> Errors { get; }
}

