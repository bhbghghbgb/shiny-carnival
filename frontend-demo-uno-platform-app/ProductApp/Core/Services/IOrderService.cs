using ProductApp.Models;

namespace ProductApp.Core.Services;

public interface IOrderService
{
    Task<OrderResponseDto?> CreateOrderAsync(CreateOrderRequest request);
}

public class OrderService : IOrderService
{
    private readonly IOrderApi _orderApi;
    private readonly IAuthService _authService;

    public OrderService(IOrderApi orderApi, IAuthService authService)
    {
        _orderApi = orderApi;
        _authService = authService;
    }

    public async Task<OrderResponseDto?> CreateOrderAsync(CreateOrderRequest request)
    {
        try
        {
            return await _orderApi.CreateOrderAsync(request);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to create order: {ex.Message}");
            return null;
        }
    }
}
