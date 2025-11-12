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

    public ProductService(IProductApi productApi)
    {
        _productApi = productApi;
    }

    public async Task<List<ProductListDto>> GetProductsAsync()
    {
        try
        {
            return await _productApi.GetProductsAsync();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Failed to get products: {ex.Message}");
            return GetSampleProducts(); // Fallback to sample data
        }
    }

    public async Task<List<ProductListDto>> SearchProductsAsync(string searchTerm)
    {
        var products = await GetProductsAsync();
        return products.Where(p => 
            p.ProductName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
            p.CategoryName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public async Task<List<ProductListDto>> GetProductsByCategoryAsync(string category)
    {
        var products = await GetProductsAsync();
        return products.Where(p => 
            p.CategoryName.Equals(category, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    private List<ProductListDto> GetSampleProducts()
    {
        return new List<ProductListDto>
        {
            new ProductListDto { Id = 1, ProductName = "Laptop", Price = 999.99m, CategoryName = "Electronics", InventoryQuantity = 10 },
            new ProductListDto { Id = 2, ProductName = "Mouse", Price = 29.99m, CategoryName = "Electronics", InventoryQuantity = 50 },
            new ProductListDto { Id = 3, ProductName = "Notebook", Price = 4.99m, CategoryName = "Stationery", InventoryQuantity = 100 },
            new ProductListDto { Id = 4, ProductName = "Pen", Price = 1.99m, CategoryName = "Stationery", InventoryQuantity = 200 }
        };
    }
}
