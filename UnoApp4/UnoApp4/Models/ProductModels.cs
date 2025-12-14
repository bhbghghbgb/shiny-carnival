namespace UnoApp4.Models;

public class ProductListDto
{
    public int Id { get; set; }
    public required string ProductName { get; set; }
    public required string Barcode { get; set; }
    public decimal Price { get; set; }
    public required string Unit { get; set; }
    public required string CategoryName { get; set; }
    public required string SupplierName { get; set; }
    public int InventoryQuantity { get; set; }
    
    public required string ImageUrl { get; set; }
    // Computed properties for formatting
    public string PriceFormatted => $"{Price:N0} đ";
    public string InventoryFormatted => $"Tồn kho: {InventoryQuantity}";
}

public class ProductResponseDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public required string CategoryName { get; set; }
    public int SupplierId { get; set; }
    public required string SupplierName { get; set; }
    public required string ProductName { get; set; }
    public required string Barcode { get; set; }
    public decimal Price { get; set; }
    public required string Unit { get; set; }
    public int InventoryQuantity { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProductSearchRequest : PagedRequest
{
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
