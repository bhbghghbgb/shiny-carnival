namespace UnoApp4.Models;

/// <summary>
/// Standard API response wrapper matching backend format
/// </summary>
public class ApiResponse<T>
{
    public bool IsError { get; set; }
    public required string Message { get; set; }
    public T? Data { get; set; }
    public DateTime Timestamp { get; set; }
    public int StatusCode { get; set; }

    // Convenience property for checking success
    public bool Success => !IsError && StatusCode is >= 200 and < 300;
}

/// <summary>
/// Paged list response for collections
/// </summary>
public class PagedList<T>
{
    public required List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

/// <summary>
/// Paged request for querying collections
/// </summary>
public class PagedRequest
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public required string SortColumn { get; set; }
    public string SortDirection { get; set; } = "asc";
}
