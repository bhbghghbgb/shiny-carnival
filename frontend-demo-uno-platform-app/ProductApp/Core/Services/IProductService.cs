using ProductApp.Models;

namespace ProductApp.Core.Services;

public interface IProductService
{
    Task<List<ProductListDto>> GetProductsAsync();
    Task<List<ProductListDto>> SearchProductsAsync(string searchTerm);
    Task<List<ProductListDto>> GetProductsByCategoryAsync(string category);
}

public class ProductService : IProductService
{
    private readonly IProductApi _productApi;
    private readonly IFakeDataService _fakeDataService;
    private readonly AppConfig _config;

    public ProductService(IProductApi productApi, IFakeDataService fakeDataService, AppConfig config)
    {
        _productApi = productApi;
        _fakeDataService = fakeDataService;
        _config = config;
    }

    public async Task<List<ProductListDto>> GetProductsAsync()
    {
        try
        {
            if (_config.UseFakeData)
            {
                await Task.Delay(500); // Simulate API delay
                return _fakeDataService.GetSampleProducts();
            }
            else
            {
                return await _productApi.GetProductsAsync();
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to get products: {ex.Message}");
            return _fakeDataService.GetSampleProducts(); // Fallback to sample data
        }
    }

    public async Task<List<ProductListDto>> SearchProductsAsync(string searchTerm)
    {
        var products = await GetProductsAsync();
        return products.Where(p => 
            p.ProductName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
            p.CategoryName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
            p.Barcode.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<List<ProductListDto>> GetProductsByCategoryAsync(string category)
    {
        var products = await GetProductsAsync();
        return products.Where(p => 
            p.CategoryName.Equals(category, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}