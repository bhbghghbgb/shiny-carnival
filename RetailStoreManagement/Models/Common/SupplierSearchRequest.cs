namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Supplier
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class SupplierSearchRequest : PagedRequest
{
    // Có thể thêm các filters riêng cho Supplier sau này
    // Ví dụ: MinProductCount, MaxProductCount, HasEmail, etc.
}

