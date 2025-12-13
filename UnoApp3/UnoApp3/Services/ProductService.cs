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
            this.Log().LogInformation("SearchProductsAsync: calling API page {page} size {size}", request.PageIndex, request.PageSize);
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
}
