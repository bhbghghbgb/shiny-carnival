using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using ProductApp.Data.Entities;
using ProductApp.Data.Repositories;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class ProductDetailViewModel : ViewModelBase
{
    private readonly ICartRepository _cartRepository;

    [ObservableProperty]
    private ProductListDto? _product;

    [ObservableProperty]
    private int _quantity = 1;

    [ObservableProperty]
    private bool _isInCart;

    [ObservableProperty]
    private int _cartQuantity;

    public ProductDetailViewModel(INavigator navigator, ICartRepository cartRepository) 
        : base(navigator)
    {
        _cartRepository = cartRepository;
    }

    public override async Task OnNavigatedToAsync()
    {
        await LoadProductDataAsync();
    }

    [RelayCommand]
    private async Task LoadProductDataAsync()
    {
        if (NavigationData is Dictionary<string, object> data && 
            data.TryGetValue("Product", out var productObj) && 
            productObj is ProductListDto product)
        {
            Product = product;
            Title = product.ProductName;
            await CheckCartStatusAsync();
        }
    }

    [RelayCommand]
    private async Task AddToCartAsync()
    {
        if (Product == null) return;

        IsBusy = true;

        try
        {
            var cartItem = new CartItem
            {
                ProductId = Product.Id,
                ProductName = Product.ProductName,
                CategoryName = Product.CategoryName,
                Price = Product.Price,
                Quantity = Quantity
            };

            await _cartRepository.AddOrUpdateAsync(cartItem);
            await CheckCartStatusAsync();
            
            // Show success message or navigate to cart
            await Navigator.NavigateViewModelAsync<CartViewModel>(this);
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to add to cart: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task ViewCartAsync()
    {
        await Navigator.NavigateViewModelAsync<CartViewModel>(this);
    }

    [RelayCommand]
    private void IncreaseQuantity()
    {
        Quantity++;
    }

    [RelayCommand]
    private void DecreaseQuantity()
    {
        if (Quantity > 1)
        {
            Quantity--;
        }
    }

    private async Task CheckCartStatusAsync()
    {
        if (Product != null)
        {
            var cartItem = await _cartRepository.GetByProductIdAsync(Product.Id);
            IsInCart = cartItem != null;
            CartQuantity = cartItem?.Quantity ?? 0;
        }
    }
}
