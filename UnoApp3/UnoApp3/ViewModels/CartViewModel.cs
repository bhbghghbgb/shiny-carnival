using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.UI.Dispatching;
using Uno.Extensions.Navigation;
using UnoApp3.Data.Entities;
using UnoApp3.Models.Product;
using UnoApp3.Services;
using UnoApp3.Services.Interfaces;

namespace UnoApp3.ViewModels;

public partial class CartViewModel : BaseViewModel
{
    private readonly ICartRepository _cartRepository;
    private readonly ProductService _productService;
    private readonly IMemoryCache _productCache;
    private readonly TimeSpan _cacheExpiry = TimeSpan.FromMinutes(10); // Adjust as needed

    [ObservableProperty] private ObservableCollection<CartItemDisplay> _cartItems;

    [ObservableProperty] private bool _hasItems;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(TotalAmountFormatted))]
    private decimal _totalAmount;

    public string TotalAmountFormatted => $"{TotalAmount:N0} đ";

    public CartViewModel(
        INavigator navigator,
        ICartRepository cartRepository,
        ProductService productService,
        IMemoryCache productCache)
        : base(navigator)
    {
        _cartRepository = cartRepository;
        _productService = productService;
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
        if (!CartItems.Any()) return;

        // Fixed: Added 'this' as first parameter
        await Navigator.NavigateRouteAsync(this, "OrderConfirmation");
    }
}
