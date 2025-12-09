using Refit;
using UnoApp3.Models.Common;
using UnoApp3.Models.Product;

namespace UnoApp3.Services.Api;

public interface IProductApi
{
    [Get("/admin/products")]
    Task<Models.Common.ApiResponse<PagedList<ProductListDto>>> GetProducts([Query] ProductSearchRequest request);

    [Get("/admin/products/{id}")]
    Task<Models.Common.ApiResponse<ProductResponseDto>> GetProduct(int id);
}
