namespace RetailStoreManagement.Models.Product;

public class ProductResponseDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int InventoryQuantity { get; set; }
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// URL ảnh sản phẩm để FE hiển thị preview.
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// ImageKit file identifier (image_file_id) dùng để FE build URL ảnh sản phẩm.
    /// </summary>
    public string? ImageFileId { get; set; }
}
