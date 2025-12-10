using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using Uno.Extensions.Navigation;
using UnoApp3.Models.Product;
using UnoApp3.Services;
using UnoApp3.Services.Interfaces;

namespace UnoApp3.ViewModels;

public partial class ProductListViewModel : BaseViewModel
{
    private readonly ProductService _productService;
    private readonly ICartRepository _cartRepository;

    [ObservableProperty]
    private string _searchText;

    [ObservableProperty]
    private ObservableCollection<ProductListDto> _products;

    [ObservableProperty]
    private bool _isRefreshing;

    public ProductListViewModel(
        INavigator navigator,
        ProductService productService,
        ICartRepository cartRepository) 
        : base(navigator)
    {
        _productService = productService;
        _cartRepository = cartRepository;
        Title = "Danh sách sản phẩm";
        Products = new ObservableCollection<ProductListDto>();
        
        LoadProductsCommand.Execute(null);
    }

    [RelayCommand]
    private async Task LoadProducts()
    {
        if (IsBusy) return;
        
        IsBusy = true;
        IsRefreshing = true;
        
        try
        {
            Products.Clear();
            
            var request = new ProductSearchRequest
            {
                PageIndex = 1,
                PageSize = 20,
                SortColumn = "productName",
                SortDirection = "asc"
            };
            
            var result = await _productService.SearchProductsAsync(request);
            
            if (result?.Items != null)
            {
                foreach (var product in result.Items)
                {
                    Products.Add(product);
                }
            }
        }
        finally
        {
            IsBusy = false;
            IsRefreshing = false;
        }
    }

    [RelayCommand]
    private async Task ViewProductDetail(ProductListDto product)
    {
        if (product == null) return;
        
        await Navigator.NavigateRouteAsync("ProductDetail", Data: new Dictionary<string, object>
        {
            ["productId"] = product.Id
        });
    }

    [RelayCommand]
    private async Task AddToCart(ProductListDto product)
    {
        if (product == null) return;
        
        await _cartRepository.AddToCartAsync(product.Id, 1);
        
        // TODO: Show confirmation message
    }

    [RelayCommand]
    private async Task GoToCart()
    {
        await Navigator.NavigateRouteAsync("Cart");
    }
}
