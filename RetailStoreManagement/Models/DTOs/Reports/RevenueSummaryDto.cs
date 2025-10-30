namespace RetailStoreManagement.Models.DTOs.Reports;

public class RevenueSummaryDto
{
    public decimal OverallRevenue { get; set; }
    public int OverallOrders { get; set; }
    public decimal OverallDiscount { get; set; }
    public decimal AverageOrderValue { get; set; }
    public string Period { get; set; } = string.Empty;
}
