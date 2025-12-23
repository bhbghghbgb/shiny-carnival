using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Product;

public class CreateProductRequest
{
    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [Required]
    [MaxLength(MAX_LENGTH_NAME)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [MaxLength(MAX_LENGTH_CODE)]
    public string Barcode { get; set; } = string.Empty;

    [Required]
    [Range((double)MIN_PRICE, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(MAX_LENGTH_UNIT)]
    public string Unit { get; set; } = "pcs";

    /// <summary>
    /// URL ảnh sản phẩm (nếu FE build sẵn từ ImageKit).
    /// </summary>
    [MaxLength(1024)]
    public string? ImageUrl { get; set; }

    /// <summary>
    /// ImageKit file identifier (image_file_id) sau khi upload ảnh sản phẩm.
    /// </summary>
    [MaxLength(MAX_LENGTH_CODE)]
    public string? ImageFileId { get; set; }
}
