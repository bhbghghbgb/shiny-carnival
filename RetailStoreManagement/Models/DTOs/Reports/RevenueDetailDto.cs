namespace RetailStoreManagement.Models.DTOs.Reports;

public class RevenueDetailDto
{
    public string Period { get; set; } = string.Empty;
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal AverageOrderValue { get; set; }
    public DateTime Date { get; set; }
}
