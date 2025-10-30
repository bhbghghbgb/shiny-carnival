using RetailStoreManagement.Common;

namespace RetailStoreManagement.Models.DTOs.Products;

public class ProductSearchRequest : PagedRequest
{
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
