using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Product;

public class UpdateProductRequest
{
    [MaxLength(MAX_LENGTH_NAME)]
    public string? ProductName { get; set; }

    [MaxLength(MAX_LENGTH_CODE)]
    public string? Barcode { get; set; }

    [Range((double)MIN_PRICE, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal? Price { get; set; }

    [MaxLength(MAX_LENGTH_UNIT)]
    public string? Unit { get; set; }

    public int? CategoryId { get; set; }

    public int? SupplierId { get; set; }

    /// <summary>
    /// URL ảnh sản phẩm mới (nếu cần cập nhật).
    /// </summary>
    [MaxLength(MAX_LENGTH_NAME)]
    public string? ImageUrl { get; set; }

    /// <summary>
    /// ImageKit file identifier mới cho ảnh sản phẩm (nếu cần cập nhật).
    /// </summary>
    [MaxLength(MAX_LENGTH_CODE)]
    public string? ImageFileId { get; set; }
}
