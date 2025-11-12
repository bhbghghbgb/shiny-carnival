using ProductApp.Models;
using Refit;

namespace ProductApp.Core.Services;

public interface IProductApi
{
    [Get("/api/products")]
    Task<List<ProductListDto>> GetProductsAsync();
}
