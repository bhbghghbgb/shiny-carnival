using UnoApp1.Models;
using Refit;

namespace UnoApp1.Core.Services;

public interface IOrderApi
{
    [Post("/api/orders")]
    Task<OrderResponseDto> CreateOrderAsync([Body] CreateOrderRequest request);
}
