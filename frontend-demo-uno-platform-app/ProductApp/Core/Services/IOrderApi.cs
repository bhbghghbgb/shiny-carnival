using ProductApp.Models;
using Refit;

namespace ProductApp.Core.Services;

public interface IOrderApi
{
    [Post("/api/orders")]
    Task<OrderResponseDto> CreateOrderAsync([Body] CreateOrderRequest request);
}
