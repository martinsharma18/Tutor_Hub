namespace TuitionPlatform.Application.Common.Exceptions;

public abstract class AppException : Exception
{
    protected AppException(string message, string? code = null) : base(message)
    {
        Code = code ?? GetType().Name;
    }

    public string Code { get; }
}

