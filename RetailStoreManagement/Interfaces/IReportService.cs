using RetailStoreManagement.Common;
using RetailStoreManagement.Models.DTOs.Reports;

namespace RetailStoreManagement.Interfaces;

public interface IReportService
{
    Task<ApiResponse<RevenueReportDto>> GetRevenueReportAsync(RevenueReportRequest request);
    Task<ApiResponse<SalesReportDto>> GetSalesReportAsync(SalesReportRequest request);
    Task<ApiResponse<List<TopProductDto>>> GetTopProductsAsync(DateTime startDate, DateTime endDate, int limit = 10);
    Task<ApiResponse<List<TopCustomerDto>>> GetTopCustomersAsync(DateTime startDate, DateTime endDate, int limit = 10);
}
