namespace RetailStoreManagement.Models.Inventory;

public class InventoryResponseDto
{
    public int InventoryId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Status { get; set; } = string.Empty; // 'in_stock' | 'low_stock' | 'out_of_stock'
}
