using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using UnoApp1.Core.Common;
using UnoApp1.Core.Services;
using UnoApp1.Data.Entities;
using UnoApp1.Data.Repositories;
using UnoApp1.Models;

namespace UnoApp1.Core.ViewModels;

public partial class ProductDetailViewModel : ObservableObject, ILoadableViewModel, INavigableViewModel
{
    private readonly IProductService _productService;
    private readonly ICartRepository _cartRepository;
    private readonly INavigationService _navigationService;

    [ObservableProperty] private ProductListDto? _product;

    [ObservableProperty] private int _quantity = 1;

    [ObservableProperty] private bool _isInCart;

    [ObservableProperty] private int _cartQuantity;

    [ObservableProperty] private bool _isBusy;

    [ObservableProperty] private string _title = "Product Details";

    public ProductDetailViewModel(
        IProductService productService,
        ICartRepository cartRepository,
        INavigationService navigationService)
    {
        _productService = productService;
        _cartRepository = cartRepository;
        _navigationService = navigationService;
    }

    public async Task OnNavigatedToAsync(IDictionary<string, object>? parameters = null)
    {
        if (parameters != null && parameters.TryGetValue("productId", out var productIdObj) &&
            productIdObj is int productId)
        {
            await LoadProductByIdAsync(productId);
        }
    }

    public Task OnNavigatedFromAsync() => Task.CompletedTask;

    private async Task LoadProductByIdAsync(int productId)
    {
        IsBusy = true;

        try
        {
            var products = await _productService.GetProductsAsync();
            Product = products.FirstOrDefault(p => p.Id == productId);

            if (Product != null)
            {
                Title = Product.ProductName;
                await CheckCartStatusAsync();
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load product: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
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

            await _navigationService.NavigateToCartAsync();
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
        await _navigationService.NavigateToCartAsync();
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
