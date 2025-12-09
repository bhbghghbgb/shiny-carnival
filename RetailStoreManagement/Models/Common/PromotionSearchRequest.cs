namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Promotion
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class PromotionSearchRequest : PagedRequest
{
    // Có thể thêm các filters riêng cho Promotion sau này
    // Ví dụ: Status, DiscountType, MinDiscountValue, etc.
}

