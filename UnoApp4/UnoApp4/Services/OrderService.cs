using UnoApp4.Services.Api;

namespace UnoApp4.Services;

public class OrderService(IOrderApi orderApi)
{
    public async Task<OrderDetailsDto> CreateOrderAsync(CreateOrderRequest request)
    {
        var response = await orderApi.CreateOrder(request);
        return response?.Data ?? throw new InvalidOperationException();
    }
}
