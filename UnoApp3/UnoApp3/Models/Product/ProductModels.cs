using UnoApp3.Models.Common;

namespace UnoApp3.Models.Product;

public class ProductListDto
{
    public int Id { get; set; }
    public string ProductName { get; set; }
    public string Barcode { get; set; }
    public decimal Price { get; set; }
    public string Unit { get; set; }
    public string CategoryName { get; set; }
    public string SupplierName { get; set; }
    public int InventoryQuantity { get; set; }
    
    public string ImageUrl { get; set; }
    // Computed properties for formatting
    public string PriceFormatted => $"{Price:N0} đ";
    public string InventoryFormatted => $"Tồn kho: {InventoryQuantity}";
}

public class ProductResponseDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; }
    public string ProductName { get; set; }
    public string Barcode { get; set; }
    public decimal Price { get; set; }
    public string Unit { get; set; }
    public int InventoryQuantity { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProductSearchRequest : PagedRequest
{
    public string? Search { get; set; }
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
