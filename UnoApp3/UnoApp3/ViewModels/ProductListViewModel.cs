using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using Uno.Extensions.Navigation;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;
using UnoApp3.Models.Product;
using UnoApp3.Services;
using UnoApp3.Services.Interfaces;

namespace UnoApp3.ViewModels;

public partial class ProductListViewModel : BaseViewModel
{
    private readonly ProductService _productService;
    private readonly ICartRepository _cartRepository;

    [ObservableProperty] private string _searchText;
    [ObservableProperty] private int _categoryId;
    [ObservableProperty] private int _supplierId;
    [ObservableProperty] private int _minPrice;
    [ObservableProperty] private int _maxPrice;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(HasProducts))]
    private ObservableCollection<ProductListDto> _products;

    // Computed property
    public bool HasProducts => Products?.Any() ?? false;

    [ObservableProperty] private bool _isRefreshing;

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
        this.Log().LogInformation("ProductListViewModel: initialized");

        // LoadProductsCommand.Execute(null);
    }

    public override async Task OnNavigatedTo(IReadOnlyDictionary<string, object>? data = null)
    {
        await base.OnNavigatedTo(data);

        // Load products when navigated to the page
        await LoadProductsCommand.ExecuteAsync(null);
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

            this.Log().LogInformation("LoadProducts: starting product search");

            var request = new ProductSearchRequest
            {
                Search = SearchText,
                PageIndex = 1,
                PageSize = 20,
                SortColumn = "productName",
                SortDirection = "asc"
            };

            var result = await _productService.SearchProductsAsync(request);

            this.Log().LogInformation("LoadProducts: products fetched: {count}", result?.Items?.Count ?? 0);

            if (result?.Items != null)
            {
                foreach (var product in result.Items)
                {
                    Products.Add(product);
                }
            }
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "LoadProducts failed");
            throw;
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

        // Fixed: Added 'this' as first parameter
        await Navigator.NavigateRouteAsync(this, "ProductDetail",
            data: product.Id);
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
        // Fixed: Added 'this' as first parameter
        await Navigator.NavigateRouteAsync(this, "Cart");
    }
}
