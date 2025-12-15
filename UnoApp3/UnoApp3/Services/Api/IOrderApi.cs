using Refit;
using UnoApp3.Models.Common;
using UnoApp3.Models.Order;

namespace UnoApp3.Services.Api;

public interface IOrderApi
{
    [Post("/public/orders")]
    Task<Models.Common.ApiResponse<OrderDetailsDto>> CreateOrder([Body] CreateOrderRequest request);
}
