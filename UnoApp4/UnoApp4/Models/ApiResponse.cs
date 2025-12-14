namespace UnoApp4.Models;

public class ApiResponse<T>
{
    public bool IsError { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public DateTime Timestamp { get; set; }
    public int StatusCode { get; set; }
}

public class PagedList<T>
{
    public required List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

public class PagedRequest
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public required string SortColumn { get; set; }
    public string SortDirection { get; set; } = "asc";
}
