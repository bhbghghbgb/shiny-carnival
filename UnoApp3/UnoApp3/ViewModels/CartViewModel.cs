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
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task UpdateQuantity(CartItem item, int quantity)
    {
        if (item == null || quantity < 1) return;
        
        await _cartRepository.UpdateCartItemAsync(item.ProductId, quantity);
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
        
        await Navigator.NavigateRouteAsync("OrderConfirmation");
    }
}
