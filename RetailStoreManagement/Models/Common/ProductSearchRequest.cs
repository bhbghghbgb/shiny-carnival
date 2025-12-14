namespace RetailStoreManagement.Models.Common;

public class ProductSearchRequest : PagedRequest
{
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? OnlyLowStock { get; set; }
}
