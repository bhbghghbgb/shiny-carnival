using Refit;

namespace UnoApp4.Services.Api;

public interface IProductApi
{
    [Get("/public/products")]
    Task<UnoApp4.Models.ApiResponse<PagedList<ProductListDto>>> GetProducts([Query] ProductSearchRequest request);

    [Get("/public/products/{id}")]
    Task<UnoApp4.Models.ApiResponse<ProductResponseDto>> GetProduct(int id);
}
