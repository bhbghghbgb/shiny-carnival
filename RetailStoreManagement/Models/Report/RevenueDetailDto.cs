namespace RetailStoreManagement.Models.Report;

public class RevenueDetailDto
{
    public string Period { get; set; } = string.Empty; // '2025-10-26', '2025-W43', '2025-10'
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal AverageOrderValue { get; set; }
    public DateTime Date { get; set; }
}
