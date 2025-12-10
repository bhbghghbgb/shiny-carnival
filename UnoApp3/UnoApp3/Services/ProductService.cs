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
        var response = await _productApi.GetProducts(request);
        return response?.Data;
    }

    public async Task<ProductResponseDto> GetProductAsync(int id)
    {
        var response = await _productApi.GetProduct(id);
        return response?.Data;
    }

    public string GetProductImageUrl(int productId, string baseUrl)
    {
        return $"{baseUrl}/images/{productId}";
    }
}
