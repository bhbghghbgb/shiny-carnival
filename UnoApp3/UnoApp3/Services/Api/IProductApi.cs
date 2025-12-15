using Refit;
using UnoApp3.Models.Common;
using UnoApp3.Models.Product;

namespace UnoApp3.Services.Api;

public interface IProductApi
{
    [Get("/public/products")]
    Task<Models.Common.ApiResponse<PagedList<ProductListDto>>> GetProducts([Query] ProductSearchRequest request);

    [Get("/public/products/{id}")]
    Task<Models.Common.ApiResponse<ProductResponseDto>> GetProduct(int id);
}
