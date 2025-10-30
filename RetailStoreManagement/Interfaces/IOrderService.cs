using RetailStoreManagement.Common;
using RetailStoreManagement.Models.DTOs.Orders;

namespace RetailStoreManagement.Interfaces;

public interface IOrderService
{
    Task<ApiResponse<OrderDetailsDto>> GetByIdAsync(int id);
    Task<ApiResponse<PagedList<OrderListDto>>> GetPagedAsync(OrderSearchRequest request);
    Task<ApiResponse<OrderDetailsDto>> CreateAsync(CreateOrderRequest request, int userId);
    Task<ApiResponse<OrderResponseDto>> UpdateStatusAsync(int id, UpdateOrderStatusRequest request, int userId);
    Task<byte[]> GenerateInvoicePdfAsync(int orderId);
}
