using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
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

    [ObservableProperty]
    private ObservableCollection<CartItem> _cartItems;
    
    [ObservableProperty]
    private bool _hasItems;

    [ObservableProperty]
    private Dictionary<int, ProductListDto> _productCache;

    [ObservableProperty]
    private decimal _totalAmount;

    public CartViewModel(
        INavigator navigator,
        ICartRepository cartRepository,
        ProductService productService) 
        : base(navigator)
    {
        _cartRepository = cartRepository;
        _productService = productService;
        Title = "Giỏ hàng";
        CartItems = new ObservableCollection<CartItem>();
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
        
            var items = await _cartRepository.GetCartItemsAsync();
        
            foreach (var item in items)
            {
                CartItems.Add(item);
            
                // Fetch product details
                var product = await _productService.GetProductAsync(item.ProductId);
                if (product != null)
                {
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
        
            HasItems = CartItems.Any();
        }
        finally
        {
            IsBusy = false;
        }
    }

    // Option 1: Separate increase/decrease commands (recommended for UI)
    [RelayCommand]
    private async Task IncreaseQuantity(CartItem item)
    {
        if (item == null) return;
        
        await _cartRepository.UpdateCartItemAsync(item.ProductId, item.Quantity + 1);
        await LoadCart();
    }

    [RelayCommand]
    private async Task DecreaseQuantity(CartItem item)
    {
        if (item == null || item.Quantity <= 1) return;
        
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
    private async Task RemoveItem(CartItem item)
    {
        if (item == null) return;
        
        await _cartRepository.RemoveFromCartAsync(item.ProductId);
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
