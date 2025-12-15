namespace UnoApp1.Models;

public class ProductSearchRequest
{
    public int? CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? Search { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
