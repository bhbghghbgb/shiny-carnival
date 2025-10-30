using RetailStoreManagement.Common;
using RetailStoreManagement.Models.DTOs.Inventory;

namespace RetailStoreManagement.Interfaces;

public interface IInventoryService
{
    Task<ApiResponse<InventoryResponseDto>> GetByProductIdAsync(int productId);
    Task<ApiResponse<PagedList<InventoryResponseDto>>> GetPagedAsync(PagedRequest request);
    Task<ApiResponse<InventoryResponseDto>> UpdateAsync(int productId, UpdateInventoryRequest request, int userId);
    Task<ApiResponse<List<LowStockAlertDto>>> GetLowStockAlertsAsync(int threshold = 10);
    Task<ApiResponse<PagedList<InventoryHistoryDto>>> GetHistoryAsync(int productId, PagedRequest request);
    Task UpdateInventoryForOrderAsync(int orderId, bool isDecrease);
}
