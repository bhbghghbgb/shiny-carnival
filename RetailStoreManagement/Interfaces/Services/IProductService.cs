using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Product;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Interfaces.Services;

public interface IProductService
{
    Task<ApiResponse<PagedList<ProductListDto>>> GetProductsAsync(ProductSearchRequest request);
    Task<ApiResponse<ProductResponseDto>> GetProductByIdAsync(int id);
    Task<ApiResponse<ProductResponseDto>> CreateProductAsync(CreateProductRequest request);
    Task<ApiResponse<ProductResponseDto>> UpdateProductAsync(int id, UpdateProductRequest request);
    Task<ApiResponse<bool>> DeleteProductAsync(int id);
}
