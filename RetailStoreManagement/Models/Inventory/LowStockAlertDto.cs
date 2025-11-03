namespace RetailStoreManagement.Models.Inventory;

public class LowStockAlertDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int CurrentQuantity { get; set; }
    public int Threshold { get; set; }
}
