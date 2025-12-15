using UnoApp3.Models.Common;
using UnoApp3.Models.Product;
using UnoApp3.Services.Api;

namespace UnoApp3.Services;

public class ProductService
{
    private readonly IProductApi _productApi;

    public ProductService(IProductApi productApi)
    {
        _productApi = productApi;
    }

    public async Task<PagedList<ProductListDto>> SearchProductsAsync(ProductSearchRequest request)
    {
        try
        {
            this.Log().LogInformation("SearchProductsAsync: calling API page {page} size {size}", request.Page,
                request.PageSize);
            var response = await _productApi.GetProducts(request);
            this.Log().LogInformation("SearchProductsAsync: received {count} items", response?.Data?.Items?.Count ?? 0);
            return response?.Data;
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "SearchProductsAsync: API call failed");
            throw;
        }
    }

    public async Task<ProductResponseDto> GetProductAsync(int id)
    {
        try
        {
            this.Log().LogInformation("GetProductAsync: getting product {id}", id);
            var response = await _productApi.GetProduct(id);
            return response?.Data;
        }
        catch (Exception ex)
        {
            this.Log().LogError(ex, "GetProductAsync: failed to get product {id}", id);
            throw;
        }
    }

    public string GetProductImageUrl(int productId, string baseUrl)
    {
        return $"{baseUrl}/images/{productId}";
    }

    // NEW: Batch fetch for performance
    public async Task<Dictionary<int, ProductResponseDto>> GetProductsByIdsAsync(List<int> productIds)
    {
        if (productIds.Count == 0) return new Dictionary<int, ProductResponseDto>();

        // Option 1: If API supports batch endpoint
        // var response = await GetProductsByIdsAsync(productIds);
        // return response.Data?.ToDictionary(p => p.Id, p => p) ?? new();

        // Option 2: Parallel individual calls (still better than waterfall)
        var tasks = productIds.Select(id => GetProductAsync(id));
        var products = await Task.WhenAll(tasks);
        return products.Where(p => p != null).ToDictionary(p => p.Id, p => p);
    }
}
