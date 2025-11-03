using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Inventory;

namespace RetailStoreManagement.Interfaces.Services;

public interface IInventoryService
{
    Task<ApiResponse<PagedList<InventoryResponseDto>>> GetInventoryAsync(PagedRequest request);
    Task<ApiResponse<InventoryResponseDto>> GetInventoryByProductIdAsync(int productId);
    Task<ApiResponse<InventoryResponseDto>> UpdateInventoryAsync(int productId, UpdateInventoryRequest request, int userId);
    Task<ApiResponse<List<LowStockAlertDto>>> GetLowStockAlertsAsync();
    Task<ApiResponse<PagedList<InventoryHistoryDto>>> GetInventoryHistoryAsync(int productId, PagedRequest request);
}
