using Refit;

namespace UnoApp4.Services.Api;

public interface IOrderApi
{
    [Post("/public/orders")]
    Task<UnoApp4.Models.ApiResponse<OrderDetailsDto>> CreateOrder([Body] CreateOrderRequest request);
}
