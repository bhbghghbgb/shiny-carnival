namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Category
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class CategorySearchRequest : PagedRequest
{
    /// <summary>
    /// Lọc theo số lượng sản phẩm tối thiểu trong category
    /// </summary>
    public int? MinProductCount { get; set; }

    /// <summary>
    /// Lọc theo số lượng sản phẩm tối đa trong category
    /// </summary>
    public int? MaxProductCount { get; set; }

    /// <summary>
    /// Lọc theo ngày tạo từ ngày này trở đi
    /// </summary>
    public DateTime? CreatedAfter { get; set; }

    /// <summary>
    /// Lọc theo ngày tạo đến ngày này
    /// </summary>
    public DateTime? CreatedBefore { get; set; }
}
