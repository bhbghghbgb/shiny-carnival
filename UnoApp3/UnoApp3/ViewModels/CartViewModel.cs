using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.UI.Dispatching;
using Uno.Extensions.Navigation;
using UnoApp3.Data.Entities;
using UnoApp3.Models.Order;
using UnoApp3.Models.Product;
using UnoApp3.Services;
using UnoApp3.Services.Interfaces;

namespace UnoApp3.ViewModels;

public partial class CartViewModel : BaseViewModel
{
    private readonly ICartRepository _cartRepository;
    private readonly ProductService _productService;
    private readonly OrderService _orderService;
    private readonly IMemoryCache _productCache;
    private readonly TimeSpan _cacheExpiry = TimeSpan.FromMinutes(10); // Adjust as needed

    [ObservableProperty] private ObservableCollection<CartItemDisplay> _cartItems;

    [ObservableProperty] private bool _hasItems;

    // New property for checkout loading state
    [ObservableProperty] private bool _isCheckingOut;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(TotalAmountFormatted))]
    private decimal _totalAmount;

    public string TotalAmountFormatted => $"{TotalAmount:N0} đ";

    public CartViewModel(
        INavigator navigator,
        ICartRepository cartRepository,
        ProductService productService,
        OrderService orderService,
        IMemoryCache productCache)
        : base(navigator)
    {
        _cartRepository = cartRepository;
        _productService = productService;
        _orderService = orderService;
        _productCache = productCache;
        Title = "Giỏ hàng";
        CartItems = new ObservableCollection<CartItemDisplay>();

        this.PropertyChanged += (s, e) =>
        {
            this.Log().LogDebug(
                $"PropertyChanged: {e.PropertyName} on thread {Environment.CurrentManagedThreadId}");
        };
    }

    [RelayCommand]
    private async Task LoadCart()
    {
        if (IsBusy) return;

        IsBusy = true;
        CartItems.Clear();
        TotalAmount = 0;
        HasItems = false;

        try
        {
            var cartItems = await _cartRepository.GetCartItemsAsync();
            if (!cartItems.Any()) return;

            var productIds = cartItems.Select(i => i.ProductId).Distinct().ToList();
            var productsDict = await GetCachedProductsAsync(productIds);

            var displayItems = new List<CartItemDisplay>(cartItems.Count);
            decimal total = 0;

            foreach (var cartItem in cartItems)
            {
                if (productsDict.TryGetValue(cartItem.ProductId, out var product))
                {
                    var displayItem = new CartItemDisplay
                    {
                        Id = cartItem.Id,
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                        ProductName = product.ProductName,
                        Price = product.Price
                    };
                    displayItems.Add(displayItem);
                    total += product.Price * cartItem.Quantity;
                }
            }

            CartItems.AddRange(displayItems);
            TotalAmount = total;
            HasItems = displayItems.Count > 0;
        }
        finally
        {
            IsBusy = false;
        }
    }

    // NEW: Cached product lookup
    private async Task<Dictionary<int, ProductResponseDto>> GetCachedProductsAsync(List<int> productIds)
    {
        var productsDict = new Dictionary<int, ProductResponseDto>();

        foreach (var id in productIds)
        {
            if (_productCache.TryGetValue($"product_{id}", out ProductResponseDto? cachedProduct))
            {
                productsDict[id] = cachedProduct!;
                continue;
            }

            // Cache miss - fetch and cache
            var product = await _productService.GetProductAsync(id);
            if (product != null)
            {
                _productCache.Set($"product_{id}", product, _cacheExpiry);
                productsDict[id] = product;
            }
        }

        return productsDict;
    }

    // Option 1: Separate increase/decrease commands (recommended for UI)
    [RelayCommand]
    private async Task IncreaseQuantity(CartItemDisplay itemDisplay)
    {
        if (itemDisplay == null) return;

        // Create the CartItem entity required by the repository
        var item = new CartItem { ProductId = itemDisplay.ProductId, Quantity = itemDisplay.Quantity };

        await _cartRepository.UpdateCartItemAsync(item.ProductId, item.Quantity + 1);
        await LoadCart();
    }

    [RelayCommand]
    private async Task DecreaseQuantity(CartItemDisplay itemDisplay)
    {
        if (itemDisplay == null || itemDisplay.Quantity <= 1) return;

        // Create the CartItem entity required by the repository
        var item = new CartItem { ProductId = itemDisplay.ProductId, Quantity = itemDisplay.Quantity };

        await _cartRepository.UpdateCartItemAsync(item.ProductId, item.Quantity - 1);
        await LoadCart();
    }

    // Option 2: If you need to set a specific quantity from a TextBox
    [RelayCommand]
    private async Task SetQuantity(CartItem item)
    {
        if (item == null || item.Quantity < 1) return;

        await _cartRepository.UpdateCartItemAsync(item.ProductId, item.Quantity);
        await LoadCart();
    }

    [RelayCommand]
    private async Task RemoveItem(CartItemDisplay itemDisplay)
    {
        if (itemDisplay == null) return;

        await _cartRepository.RemoveFromCartAsync(itemDisplay.ProductId);
        await LoadCart();
    }

    [RelayCommand]
    private async Task Checkout()
    {
        if (!CartItems.Any() || IsCheckingOut) return;

        IsCheckingOut = true;


        try
        {
            // Prepare the order request
            var orderRequest = new CreateOrderRequest
            {
                CustomerId = 2, // You'll need to get this from user authentication/context
                PromoCode = string.Empty, // Optional: add promo code field in UI
                OrderItems = CartItems.Select(item => new OrderItemInput
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                }).ToList()
            };

            // Call the order service to create the order
            var orderDetails = await _orderService.CreateOrderAsync(orderRequest);

            if (orderDetails != null)
            {
                // Clear the cart after successful order creation
                await ClearCartAfterOrder();

                // Navigate to order confirmation page with order details
                await Navigator.NavigateRouteAsync(this, "OrderConfirmation",
                    data: new Dictionary<string, object> { ["order"] = orderDetails });
            }
            else
            {
                // Handle API error (order creation failed)
                await ShowCheckoutError("Không thể tạo đơn hàng. Vui lòng thử lại sau.");
            }
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "Checkout failed");
            await ShowCheckoutError($"Lỗi: {ex.Message}");
        }
        finally
        {
            IsCheckingOut = false;
        }

        // Fixed: Added 'this' as first parameter
        await Navigator.NavigateRouteAsync(this, "OrderConfirmation");
    }

    private async Task ClearCartAfterOrder()
    {
        try
        {
            // Clear all items from cart
            foreach (var item in CartItems)
            {
                await _cartRepository.RemoveFromCartAsync(item.ProductId);
            }

            // Clear local collection
            CartItems.Clear();
            TotalAmount = 0;
            HasItems = false;
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "Failed to clear cart after order");
            // Don't throw here, order was already created
        }
    }

    private async Task ShowCheckoutError(string errorMessage)
    {
        // You can use a dialog or show error inline
        // For now, navigate to order confirmation with error
        await Navigator.NavigateRouteAsync(this, "OrderConfirmation",
            data: new Dictionary<string, object> { ["error"] = errorMessage });
    }

    [RelayCommand]
    private async Task ContinueShopping()
    {
        await Navigator.NavigateRouteAsync(this, "ProductList", qualifier: Qualifiers.ClearBackStack);
    }
}
