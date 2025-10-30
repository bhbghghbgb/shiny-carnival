namespace RetailStoreManagement.Models.DTOs.Reports;

public class CategorySalesDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public decimal TotalRevenue { get; set; }
    public int TotalQuantitySold { get; set; }
    public int ProductCount { get; set; }
}
