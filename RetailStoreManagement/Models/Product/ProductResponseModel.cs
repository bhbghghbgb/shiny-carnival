namespace RetailStoreManagement.Models;

public class ProductResponseModel
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Barcode { get; set; } = null;
    public string Unit { get; set; } = "pcs";
    public string CategoryName { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
}
