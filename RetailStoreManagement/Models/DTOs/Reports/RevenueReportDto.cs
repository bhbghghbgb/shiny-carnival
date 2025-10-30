namespace RetailStoreManagement.Models.DTOs.Reports;

public class RevenueReportDto
{
    public RevenueSummaryDto Summary { get; set; } = new();
    public List<RevenueDetailDto> Details { get; set; } = new();
}
