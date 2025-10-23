using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models;

public class ProductUpdateModel
{
    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Barcode { get; set; } = null;

    [Required]
    public decimal Price { get; set; }

    [MaxLength(20)]
    public string Unit { get; set; } = "pcs";
}
