using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ProductApp.Core.Services;
using ProductApp.Models;
using Uno.Extensions.Navigation;

namespace ProductApp.Core.ViewModels;

public partial class ProductListViewModel : ViewModelBase
{
    private readonly IProductService _productService;

    [ObservableProperty]
    private List<ProductListDto> _products = new();

    [ObservableProperty]
    private List<ProductListDto> _filteredProducts = new();

    [ObservableProperty]
    private List<string> _categories = new();

    [ObservableProperty]
    private string _selectedCategory = "All";

    [ObservableProperty]
    private string _searchText = string.Empty;

    [ObservableProperty]
    private bool _showSearchResults;

    public ProductListViewModel(INavigator navigator, IProductService productService) 
        : base(navigator)
    {
        _productService = productService;
    }

    public override async Task OnNavigatedToAsync()
    {
        await LoadProductsAsync();
    }

    [RelayCommand]
    private async Task LoadProductsAsync()
    {
        IsBusy = true;
        
        try
        {
            Products = await _productService.GetProductsAsync();
            UpdateCategories();
            ApplyFilters();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to load products: {ex.Message}");
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task ViewProductDetailAsync(ProductListDto product)
    {
        if (product != null)
        {
            var parameters = new Dictionary<string, object> { ["Product"] = product };
            await Navigator.NavigateViewModelAsync<ProductDetailViewModel>(this, data: parameters);
        }
    }

    [RelayCommand]
    private void SearchProducts()
    {
        ApplyFilters();
        ShowSearchResults = !string.IsNullOrWhiteSpace(SearchText);
    }

    [RelayCommand]
    private void ClearSearch()
    {
        SearchText = string.Empty;
        ShowSearchResults = false;
        ApplyFilters();
    }

    [RelayCommand]
    private void FilterByCategory(string category)
    {
        SelectedCategory = category;
        ApplyFilters();
    }

    private void UpdateCategories()
    {
        var allCategories = Products
            .Select(p => p.CategoryName)
            .Distinct()
            .OrderBy(c => c)
            .ToList();
        
        Categories = new List<string> { "All" }.Concat(allCategories).ToList();
    }

    private void ApplyFilters()
    {
        var filtered = Products.AsEnumerable();

        // Apply category filter
        if (!string.IsNullOrEmpty(SelectedCategory) && SelectedCategory != "All")
        {
            filtered = filtered.Where(p => p.CategoryName == SelectedCategory);
        }

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(SearchText))
        {
            filtered = filtered.Where(p => 
                p.ProductName.Contains(SearchText, StringComparison.OrdinalIgnoreCase) ||
                p.CategoryName.Contains(SearchText, StringComparison.OrdinalIgnoreCase));
        }

        FilteredProducts = filtered.ToList();
    }

    partial void OnSearchTextChanged(string value)
    {
        ApplyFilters();
        ShowSearchResults = !string.IsNullOrWhiteSpace(value);
    }

    partial void OnSelectedCategoryChanged(string value)
    {
        ApplyFilters();
    }
}
