namespace UnoApp3.Models.Common;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
}

public class PagedList<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}

public class PagedRequest
{
    public int? Page { get; set; } = 1;
    public int? PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool? SortDesc { get; set; } = true;
}
