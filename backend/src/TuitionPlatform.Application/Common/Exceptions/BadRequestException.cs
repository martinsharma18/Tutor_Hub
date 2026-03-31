namespace TuitionPlatform.Application.Common.Exceptions;

public class BadRequestException : AppException
{
    public BadRequestException(string message)
        : base(message, "bad_request")
    {
    }
}
