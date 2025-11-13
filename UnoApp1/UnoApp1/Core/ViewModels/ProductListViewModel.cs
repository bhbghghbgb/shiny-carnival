using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using UnoApp1.Core.Common;
using UnoApp1.Core.Services;
using UnoApp1.Models;

namespace UnoApp1.Core.ViewModels;

public partial class ProductListViewModel : ObservableObject, ILoadableViewModel, INavigableViewModel
{
    private readonly IProductService _productService;
    private readonly INavigationService _navigationService;

    [ObservableProperty] private List<ProductListDto> _products = new();

    [ObservableProperty] private List<ProductListDto> _filteredProducts = new();

    [ObservableProperty] private List<string> _categories = new();

    [ObservableProperty] private string _selectedCategory = "All";

    [ObservableProperty] private string _searchText = string.Empty;

    [ObservableProperty] private bool _showSearchResults;

    [ObservableProperty] private bool _isBusy;

    [ObservableProperty] private string _title = "Products";

    public ProductListViewModel(IProductService productService, INavigationService navigationService)
    {
        _productService = productService;
        _navigationService = navigationService;
    }

    public async Task OnNavigatedToAsync(IDictionary<string, object>? parameters = null)
    {
        await LoadProductsAsync();
    }

    public Task OnNavigatedFromAsync() => Task.CompletedTask;

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
            await _navigationService.NavigateToProductDetailAsync(product.Id);
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

        if (!string.IsNullOrEmpty(SelectedCategory) && SelectedCategory != "All")
        {
            filtered = filtered.Where(p => p.CategoryName == SelectedCategory);
        }

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
