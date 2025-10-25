using System.ComponentModel.DataAnnotations;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Models.Product;

public class ProductUpdateModel
{
    [Required]
    [MinLength(1, ErrorMessage = "Tên sản phẩm không được để trống")]
    [MaxLength(100, ErrorMessage = "Tên sản phẩm không được vượt quá 100 ký tự")]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [MaxLength(50)]
    public string? Barcode { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Giá sản phẩm phải lớn hơn 0")]
    public decimal Price { get; set; }

    [Required]
    [EnumDataType(typeof(ProductUnit))]
    public ProductUnit Unit { get; set; } = ProductUnit.Pcs;
}
