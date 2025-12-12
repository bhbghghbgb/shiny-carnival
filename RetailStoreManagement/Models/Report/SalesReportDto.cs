namespace RetailStoreManagement.Models.Report;

public class SalesReportDto
{
    public List<TopProductDto> TopProducts { get; set; } = new();
    public List<TopCustomerDto> TopCustomers { get; set; } = new();
    public List<CategorySalesDto> CategoryBreakdown { get; set; } = new();
}
