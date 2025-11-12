using UnoApp1.Models;
using Refit;

namespace UnoApp1.Core.Services;

public interface IProductApi
{
    [Get("/api/products")]
    Task<List<ProductListDto>> GetProductsAsync();
}
