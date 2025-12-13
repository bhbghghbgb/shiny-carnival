using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
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

    [ObservableProperty] private ObservableCollection<CartItemDisplay> _cartItems;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(IsCheckoutEnabled))]
    private bool _hasItems;

    [ObservableProperty] private Dictionary<int, ProductListDto> _productCache;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(TotalAmountFormatted))]
    private decimal _totalAmount;

    public bool IsCheckoutEnabled => HasItems;
    public string TotalAmountFormatted => $"{TotalAmount:N0} đ";

    public CartViewModel(
        INavigator navigator,
        ICartRepository cartRepository,
        ProductService productService)
        : base(navigator)
    {
        _cartRepository = cartRepository;
        _productService = productService;
        Title = "Giỏ hàng";
        CartItems = new ObservableCollection<CartItemDisplay>();
        ProductCache = new Dictionary<int, ProductListDto>();

        LoadCartCommand.Execute(null);
    }

    [RelayCommand]
    private async Task LoadCart()
    {
        if (IsBusy) return;

        IsBusy = true;

        try
        {
            CartItems.Clear();
            ProductCache.Clear();
            TotalAmount = 0;
            HasItems = false;

            var items = await _cartRepository.GetCartItemsAsync();
            HasItems = items.Count > 0;

            foreach (var item in items)
            {
                // Fetch product details
                var product = await _productService.GetProductAsync(item.ProductId);
                if (product != null)
                {
                    CartItems.Add(new CartItemDisplay
                    {
                        Id = item.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        ProductName = product.ProductName,
                        Price = product.Price
                    });

                    var productDto = new ProductListDto
                    {
                        Id = product.Id,
                        ProductName = product.ProductName,
                        Price = product.Price,
                        Unit = product.Unit
                    };

                    ProductCache[item.ProductId] = productDto;
                    TotalAmount += product.Price * item.Quantity;
                }
            }
        }
        finally
        {
            IsBusy = false;
        }
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
