using UnoApp3.Models.Order;
using UnoApp3.Services.Api;

namespace UnoApp3.Services;

public class OrderService
{
    private readonly IOrderApi _orderApi;

    public OrderService(IOrderApi orderApi)
    {
        _orderApi = orderApi;
    }

    public async Task<OrderDetailsDto> CreateOrderAsync(CreateOrderRequest request)
    {
        var response = await _orderApi.CreateOrder(request);
        return response?.Data;
    }
}
