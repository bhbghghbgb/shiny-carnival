namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho phân trang với đầy đủ tính năng
/// Kế thừa từ BasePagedRequest và thêm Search, SortBy, SortDesc
/// Sử dụng cho các endpoint cần search và sorting động
/// </summary>
public class PagedRequest : BasePagedRequest
{
    /// <summary>
    /// Từ khóa tìm kiếm (optional)
    /// </summary>
    public string? Search { get; set; }

    /// <summary>
    /// Tên property để sắp xếp (mặc định: "Id")
    /// </summary>
    public string SortBy { get; set; } = "Id";

    /// <summary>
    /// Sắp xếp giảm dần (true) hoặc tăng dần (false)
    /// </summary>
    public bool SortDesc { get; set; } = true;
}

