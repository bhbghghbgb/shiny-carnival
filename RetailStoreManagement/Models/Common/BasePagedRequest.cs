namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Base class cho tất cả các request có phân trang
/// Chỉ chứa các thuộc tính cơ bản: Page và PageSize
/// Sử dụng cho các endpoint không cần Search, SortBy, SortDesc (ví dụ: Report endpoints)
/// </summary>
public class BasePagedRequest
{
    private const int MaxPageSize = 100;
    
    /// <summary>
    /// Số trang hiện tại (bắt đầu từ 1)
    /// </summary>
    public int Page { get; set; } = 1;
    
    private int _pageSize = 10;

    /// <summary>
    /// Số lượng items trên mỗi trang (tối đa 100)
    /// </summary>
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
}

