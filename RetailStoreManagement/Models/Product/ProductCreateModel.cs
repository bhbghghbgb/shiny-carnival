using System.ComponentModel.DataAnnotations;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Models.Product;

public class ProductCreateModel
{
    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [MaxLength(50)]
    public string? Barcode { get; set; } = null;

    [Required]
    public decimal Price { get; set; }

    [MaxLength(20)]
    public ProductUnit Unit { get; set; } = ProductUnit.Pcs;
}
