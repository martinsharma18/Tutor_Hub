namespace TuitionPlatform.Application.Common.Models;

public class ApiResponse<T>
{
    public ApiResponse(T data, string? message = null)
    {
        Data = data;
        Message = message;
    }

    public T Data { get; }

    public string? Message { get; }
}

