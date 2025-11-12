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
    private readonly IFakeDataService _fakeDataService;
    private readonly AppConfig _config;

    public OrderService(IOrderApi orderApi, IAuthService authService, IFakeDataService fakeDataService, AppConfig config)
    {
        _orderApi = orderApi;
        _authService = authService;
        _fakeDataService = fakeDataService;
        _config = config;
    }

    public async Task<OrderResponseDto?> CreateOrderAsync(CreateOrderRequest request)
    {
        try
        {
            if (_config.UseFakeData)
            {
                await Task.Delay(1000); // Simulate API delay
                return _fakeDataService.GetSampleOrderResponse();
            }
            else
            {
                return await _orderApi.CreateOrderAsync(request);
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to create order: {ex.Message}");
            return null;
        }
    }
}