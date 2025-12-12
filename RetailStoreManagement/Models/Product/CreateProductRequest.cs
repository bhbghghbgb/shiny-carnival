using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Product;

public class CreateProductRequest
{
    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Barcode { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(20)]
    public string Unit { get; set; } = "pcs";
}
