namespace RetailStoreManagement.Models.Report;

public class RevenueReportDto
{
    public RevenueSummaryDto Summary { get; set; } = new();
    public List<RevenueDetailDto> Details { get; set; } = new();
}
