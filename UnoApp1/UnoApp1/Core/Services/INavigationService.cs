/// UnoApp1/Core/Services/INavigationService.cs

using UnoApp1.Core.ViewModels;

namespace UnoApp1.Core.Services;

public interface INavigationService
{
    Task NavigateToLoginAsync();
    Task NavigateToHomeAsync();
    Task NavigateToProductDetailAsync(int productId);
    Task NavigateToCartAsync();
    Task NavigateToOrderConfirmationAsync(); // No parameters - reads from cart service
    Task NavigateBackAsync();
}

public class NavigationService : INavigationService
{
    private readonly INavigator _navigator;

    public NavigationService(INavigator navigator)
    {
        _navigator = navigator;
    }

    public Task NavigateToLoginAsync()
        => _navigator.NavigateViewModelAsync<LoginViewModel>(_navigator);

    public Task NavigateToHomeAsync()
        => _navigator.NavigateViewModelAsync<HomeViewModel>(_navigator);

    public async Task NavigateToProductDetailAsync(int productId)
    {
        var data = new Dictionary<string, object> { ["productId"] = productId };
        await _navigator.NavigateViewModelAsync<ProductDetailViewModel>(_navigator, data: data);
    }

    public Task NavigateToCartAsync()
        => _navigator.NavigateViewModelAsync<CartViewModel>(_navigator);

    public Task NavigateToOrderConfirmationAsync()
        => _navigator.NavigateViewModelAsync<OrderConfirmationViewModel>(_navigator);

    public Task NavigateBackAsync()
        => _navigator.NavigateBackAsync(_navigator);
}
