namespace RetailStoreManagement.Models.Common;

/// <summary>
/// Request model cho tìm kiếm và phân trang Inventory
/// Kế thừa từ PagedRequest để có các thuộc tính phân trang cơ bản
/// </summary>
public class InventorySearchRequest : PagedRequest
{
    /// <summary>
    /// Lọc theo ProductId
    /// </summary>
    public int? ProductId { get; set; }

    /// <summary>
    /// Lọc theo số lượng tối thiểu
    /// </summary>
    public int? MinQuantity { get; set; }

    /// <summary>
    /// Lọc theo số lượng tối đa
    /// </summary>
    public int? MaxQuantity { get; set; }
}

