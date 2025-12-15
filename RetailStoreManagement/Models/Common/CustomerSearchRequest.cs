namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Customer
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class CustomerSearchRequest : PagedRequest
{
    // Có thể thêm các filters riêng cho Customer sau này
    // Ví dụ: MinTotalSpent, MaxTotalSpent, HasEmail, etc.
}

