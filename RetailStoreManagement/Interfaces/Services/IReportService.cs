using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Report;

namespace RetailStoreManagement.Interfaces.Services;

public interface IReportService
{
    Task<ApiResponse<RevenueReportDto>> GetRevenueReportAsync(RevenueReportRequest request);
    Task<ApiResponse<SalesReportDto>> GetSalesReportAsync(SalesReportRequest request);
    Task<ApiResponse<List<TopProductDto>>> GetTopProductsAsync(DateTime startDate, DateTime endDate, int limit = 10);
    Task<ApiResponse<List<TopCustomerDto>>> GetTopCustomersAsync(DateTime startDate, DateTime endDate, int limit = 10);
}
