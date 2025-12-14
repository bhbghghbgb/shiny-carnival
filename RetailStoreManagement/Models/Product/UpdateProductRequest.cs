using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Product;

public class UpdateProductRequest
{
    [MaxLength(100)]
    public string? ProductName { get; set; }

    [MaxLength(50)]
    public string? Barcode { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal? Price { get; set; }

    [MaxLength(20)]
    public string? Unit { get; set; }

    public int? CategoryId { get; set; }

    public int? SupplierId { get; set; }
}
