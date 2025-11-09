namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang User
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class UserSearchRequest : PagedRequest
{
    /// <summary>
    /// Lọc theo Role (0: Admin, 1: Staff)
    /// </summary>
    public int? Role { get; set; }
}

