using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using ProductApp.Data.Entities;
using ProductApp.Data.Repositories;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class CartViewModel : ViewModelBase
{
    private readonly ICartRepository _cartRepository;
    private readonly IOrderService _orderService;

    [ObservableProperty]
    private List<CartItem> _cartItems = new();

    [ObservableProperty]
    private decimal _totalAmount;

    [ObservableProperty]
    private int _totalItems;

    [ObservableProperty]
    private bool _isEmpty = true;

    public CartViewModel(INavigator navigator, ICartRepository cartRepository, IOrderService orderService) 
        : base(navigator)
    {
        _cartRepository = cartRepository;
        _orderService = orderService;
        Title = "Shopping Cart";
    }

    public override async Task OnNavigatedToAsync()
    {
        await LoadCartAsync();
    }

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
                
                var parameters = new Dictionary<string, object> 
                { 
                    ["Order"] = orderResponse 
                };
                await Navigator.NavigateViewModelAsync<OrderConfirmationViewModel>(this, data: parameters);
            }
            else
            {
                // Handle order failure
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
        await Navigator.GoBackAsync(this);
    }

    private void CalculateTotals()
    {
        TotalItems = CartItems.Sum(ci => ci.Quantity);
        TotalAmount = CartItems.Sum(ci => ci.TotalPrice);
    }
}
