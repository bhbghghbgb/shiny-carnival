using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Inventory;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Interfaces.Services;

public interface IInventoryService
{
    Task<ApiResponse<PagedList<InventoryResponseDto>>> GetInventoryAsync(InventorySearchRequest request);
    Task<ApiResponse<InventoryResponseDto>> GetInventoryByProductIdAsync(int productId);
    Task<ApiResponse<InventoryResponseDto>> UpdateInventoryAsync(int productId, UpdateInventoryRequest request, int userId);
    Task<ApiResponse<List<LowStockAlertDto>>> GetLowStockAlertsAsync();
    Task<ApiResponse<PagedList<InventoryHistoryDto>>> GetInventoryHistoryAsync(int productId, PagedRequest request);
}
