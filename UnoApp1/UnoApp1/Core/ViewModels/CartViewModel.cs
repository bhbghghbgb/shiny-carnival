using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using UnoApp1.Core.Common;
using UnoApp1.Core.Services;
using UnoApp1.Data.Entities;
using UnoApp1.Data.Repositories;
using UnoApp1.Models;

namespace UnoApp1.Core.ViewModels;

public partial class CartViewModel : ObservableObject, ILoadableViewModel, INavigableViewModel
{
    private readonly ICartRepository _cartRepository;
    private readonly IOrderService _orderService;
    private readonly INavigationService _navigationService;

    [ObservableProperty] private List<CartItem> _cartItems = new();

    [ObservableProperty] private decimal _totalAmount;

    [ObservableProperty] private int _totalItems;

    [ObservableProperty] private bool _isEmpty = true;

    [ObservableProperty] private bool _isBusy;

    [ObservableProperty] private string _title = "Shopping Cart";

    public CartViewModel(
        ICartRepository cartRepository,
        IOrderService orderService,
        INavigationService navigationService)
    {
        _cartRepository = cartRepository;
        _orderService = orderService;
        _navigationService = navigationService;
    }

    public async Task OnNavigatedToAsync(IDictionary<string, object>? parameters = null)
    {
        await LoadCartAsync();
    }

    public Task OnNavigatedFromAsync() => Task.CompletedTask;

    [RelayCommand]
    private async Task LoadCartAsync()
    {
        IsBusy = true;

        try
        {
            CartItems = await _cartRepository.GetAllAsync();
            CalculateTotals();
            IsEmpty = !CartItems.Any();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load cart: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task UpdateQuantityAsync(CartItem cartItem)
    {
        if (cartItem.Quantity <= 0)
        {
            await RemoveFromCartAsync(cartItem);
        }
        else
        {
            await _cartRepository.AddOrUpdateAsync(cartItem);
            CalculateTotals();
        }
    }

    [RelayCommand]
    private async Task RemoveFromCartAsync(CartItem cartItem)
    {
        try
        {
            await _cartRepository.RemoveAsync(cartItem.Id);
            CartItems.Remove(cartItem);
            CalculateTotals();
            IsEmpty = !CartItems.Any();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to remove from cart: {ex.Message}");
        }
    }

    [RelayCommand]
    private async Task ConfirmPurchaseAsync()
    {
        if (!CartItems.Any()) return;

        IsBusy = true;

        try
        {
            // Create order from cart items
            var orderRequest = new CreateOrderRequest
            {
                CustomerId = 1, // Default customer for demo
                OrderItems = CartItems.Select(ci => new OrderItemInput
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity
                }).ToList()
            };

            var orderResponse = await _orderService.CreateOrderAsync(orderRequest);

            if (orderResponse != null)
            {
                // Clear cart and navigate to confirmation
                await _cartRepository.ClearAllAsync();
                await _navigationService.NavigateToOrderConfirmationAsync();
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("Order creation failed");
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Purchase failed: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task ContinueShoppingAsync()
    {
        await _navigationService.NavigateBackAsync();
    }

    private void CalculateTotals()
    {
        TotalItems = CartItems.Sum(ci => ci.Quantity);
        TotalAmount = CartItems.Sum(ci => ci.TotalPrice);
    }
}
