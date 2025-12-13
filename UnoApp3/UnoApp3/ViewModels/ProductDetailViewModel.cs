using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Uno.Extensions.Navigation;
using UnoApp3.Helpers.Converters;
using UnoApp3.Models.Product;
using UnoApp3.Services;
using UnoApp3.Services.Interfaces;

namespace UnoApp3.ViewModels;

public partial class ProductDetailViewModel : BaseViewModel
{
    private readonly ProductService _productService;
    private readonly ICartRepository _cartRepository;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(PriceFormatted))]
    [NotifyPropertyChangedFor(nameof(UnitFormatted))]
    [NotifyPropertyChangedFor(nameof(CreatedAtFormatted))]
    private ProductResponseDto? _product;

    // Computed properties - no [ObservableProperty] needed
    public string PriceFormatted => Product != null ? $"Giá: {Product.Price:N0} đ" : "Loading";
    public string UnitFormatted => Product != null ? $"/ {Product.Unit}" : "Loading";
    public string CreatedAtFormatted => Product != null ? $"{Product.CreatedAt:dd/MM/yyyy HH:mm}" : "Loading";

    [ObservableProperty] private string _productImageUrl;

    public ProductDetailViewModel(
        INavigator navigator,
        ProductService productService,
        ICartRepository cartRepository)
        : base(navigator)
    {
        _productService = productService;
        _cartRepository = cartRepository;
        Title = "Chi tiết sản phẩm";
    }

    public override async Task OnNavigatedTo(IReadOnlyDictionary<string, object>? data = null)
    {
        await base.OnNavigatedTo(data);

        if (data != null && data.TryGetValue("productId", out var productIdObj) && productIdObj is int productId)
        {
            this.Log().LogInformation("ProductDetailViewModel: navigated to product {id}", productId);
            await LoadProduct(productId);
        }
    }

    private async Task LoadProduct(int productId)
    {
        IsBusy = true;
        try
        {
            this.Log().LogInformation("LoadProduct: loading product {id}", productId);
            Product = await _productService.GetProductAsync(productId);
            if (Product != null)
            {
                ProductImageUrl = _productService.GetProductImageUrl(productId, ProductImageUrlConverter.BaseImageUrl);
            }
        }
        finally
        {
            IsBusy = false;
        }
    }

    [RelayCommand]
    private async Task AddToCart()
    {
        if (Product == null) return;

        await _cartRepository.AddToCartAsync(Product.Id, 1);

        // TODO: Show success message
        // Optionally go back
        await Navigator.NavigateBackAsync(this);
    }
}
