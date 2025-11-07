namespace RetailStoreManagement.Models.Common;

public class PagedRequest
{
    private const int MaxPageSize = 100;
    public int Page { get; set; } = 1;
    private int _pageSize = 10;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }

    public string? Search { get; set; }
    public string SortBy { get; set; } = "Id";
    public bool SortDesc { get; set; } = true;
}

