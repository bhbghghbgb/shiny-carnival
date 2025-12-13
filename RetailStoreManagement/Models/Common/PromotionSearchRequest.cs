namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Promotion
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class PromotionSearchRequest : PagedRequest
{
    /// <summary>
    /// Lọc theo trạng thái khuyến mãi: "active" hoặc "inactive"
    /// </summary>
    public string? Status { get; set; }
}

