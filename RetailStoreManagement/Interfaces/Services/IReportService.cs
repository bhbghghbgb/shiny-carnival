using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Report;

namespace RetailStoreManagement.Interfaces.Services;

public interface IReportService
{
    Task<ApiResponse<RevenueReportDto>> GetRevenueReportAsync(RevenueReportRequest request);
    Task<ApiResponse<SalesReportDto>> GetSalesReportAsync(SalesReportRequest request);
    Task<ApiResponse<PagedList<TopProductDto>>> GetTopProductsAsync(TopProductsSearchRequest request);
    Task<ApiResponse<PagedList<TopCustomerDto>>> GetTopCustomersAsync(TopCustomersSearchRequest request);

    Task<ApiResponse<PromotionReportDto>> GetPromotionReportAsync(PromotionReportRequest request);
    Task<ApiResponse<InventoryForecastReportDto>> GetInventoryForecastAsync(InventoryForecastRequest request);
}
