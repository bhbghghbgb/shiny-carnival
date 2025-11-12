namespace RetailStoreManagement.Common;

public class ApiResponse<T>
{
    public bool IsError { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int StatusCode { get; set; } = 200;


    public static ApiResponse<T> Success(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            IsError = false,
            Data = data,
            Message = message
        };
    }

        public static ApiResponse<T> Error(string message)
    {
        return new ApiResponse<T>
        {
            IsError = true,
            Message = message
        };
    }

    public static ApiResponse<T> Error(string message, int statusCode)
    {
        return new ApiResponse<T>
        {
            IsError = true,
            Message = message,
            StatusCode = statusCode
        };
    }


}