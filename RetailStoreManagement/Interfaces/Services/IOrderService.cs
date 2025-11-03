using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Order;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Interfaces.Services;

public interface IOrderService
{
    Task<ApiResponse<PagedList<OrderListDto>>> GetOrdersAsync(OrderSearchRequest request);
    Task<ApiResponse<OrderDetailsDto>> GetOrderByIdAsync(int id);
    Task<ApiResponse<OrderDetailsDto>> CreateOrderAsync(CreateOrderRequest request, int userId);
    Task<ApiResponse<OrderResponseDto>> UpdateOrderStatusAsync(int id, UpdateOrderStatusRequest request);
    Task<ApiResponse<OrderItemResponseDto>> AddOrderItemAsync(int orderId, AddOrderItemRequest request);
    Task<ApiResponse<OrderItemResponseDto>> UpdateOrderItemAsync(int orderId, int itemId, UpdateOrderItemRequest request);
    Task<ApiResponse<bool>> DeleteOrderItemAsync(int orderId, int itemId);
    Task<byte[]> GenerateInvoicePdfAsync(int orderId);
}
