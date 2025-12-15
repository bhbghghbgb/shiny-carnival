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
    [ObservableProperty] private int? _categoryId;
    [ObservableProperty] private int? _supplierId;
    [ObservableProperty] private decimal? _minPrice;
    [ObservableProperty] private decimal? _maxPrice;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(HasProducts))]
    private ObservableCollection<ProductListDto> _products;

    // Pagination properties
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(HasPreviousPage))]
    [NotifyPropertyChangedFor(nameof(HasNextPage))]
    [NotifyPropertyChangedFor(nameof(PageInfo))]
    private int _currentPage = 1;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(HasNextPage))]
    [NotifyPropertyChangedFor(nameof(PageInfo))]
    private int _totalPages = 1;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(PageInfo))]
    private int _totalCount;

    [ObservableProperty] private int _pageSize = 20;

    // Computed properties
    public bool HasProducts => Products.Count > 0;
    public bool HasPreviousPage => CurrentPage > 1;
    public bool HasNextPage => CurrentPage < TotalPages;
    public string PageInfo => $"Trang {CurrentPage}/{TotalPages} ({TotalCount} sản phẩm)";

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
        Products.CollectionChanged += (s, e) => OnPropertyChanged(nameof(HasProducts));
        this.Log().LogInformation("ProductListViewModel: initialized");
    }

    public override async Task OnNavigatedTo(IReadOnlyDictionary<string, object>? data = null)
    {
        await base.OnNavigatedTo(data);

        // Reset to page 1 when navigating to the page
        CurrentPage = 1;
        await LoadProducts();
    }

    [RelayCommand]
    public async Task LoadProducts(bool resetPage = false)
    {
        if (IsBusy) return;

        if (resetPage)
        {
            CurrentPage = 1;
        }

        IsBusy = true;
        IsRefreshing = true;

        try
        {
            Products.Clear();

            this.Log().LogInformation("LoadProducts: starting product search");

            var request = new ProductSearchRequest
            {
                Search = !string.IsNullOrWhiteSpace(SearchText) ? SearchText : null,
                CategoryId = CategoryId,
                SupplierId = SupplierId,
                MinPrice = MinPrice,
                MaxPrice = MaxPrice,
                Page = CurrentPage,
                PageSize = PageSize,
                SortBy = null,
                SortDesc = false
            };

            var result = await _productService.SearchProductsAsync(request);

            this.Log().LogInformation("LoadProducts: products fetched: {count}", result?.Items?.Count ?? 0);

            if (result != null)
            {
                TotalCount = result.TotalCount;
                TotalPages = result.TotalPages;

                if (result.Items != null)
                {
                    Products.AddRange(result.Items);
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
    private async Task NextPage()
    {
        if (CurrentPage < TotalPages)
        {
            CurrentPage++;
            await LoadProducts();
        }
    }

    [RelayCommand]
    private async Task PreviousPage()
    {
        if (CurrentPage > 1)
        {
            CurrentPage--;
            await LoadProducts();
        }
    }

    [RelayCommand]
    private async Task GoToPage(int page)
    {
        if (page >= 1 && page <= TotalPages)
        {
            CurrentPage = page;
            await LoadProducts();
        }
    }

    [RelayCommand]
    private async Task ApplyFilters()
    {
        // Reset to page 1 when applying filters
        await LoadProducts();
    }

    [RelayCommand]
    private void ClearFilters()
    {
        SearchText = string.Empty;
        CategoryId = null;
        SupplierId = null;
        MinPrice = null;
        MaxPrice = null;
        // Don't load here, let user click apply
    }

    [RelayCommand]
    private async Task ViewProductDetail(ProductListDto product)
    {
        if (product == null) return;

        await Navigator.NavigateRouteAsync(this, "ProductDetail",
            data: product.Id);
    }

    [RelayCommand]
    private async Task AddToCart(ProductListDto product)
    {
        if (product == null) return;

        await _cartRepository.AddToCartAsync(product.Id, 1);

        // TODO: Show confirmation message
        // You can add a toast notification or update cart badge
    }

    [RelayCommand]
    private async Task GoToCart()
    {
        await Navigator.NavigateRouteAsync(this, "Cart");
    }
}
