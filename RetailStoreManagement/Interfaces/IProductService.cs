using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Product;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface IProductService
{
    Task<ApiResponse<IPagedList<ProductResponseModel>>> GetPagedAsync(PagedRequest request);
    Task<ApiResponse<ProductResponseModel>> GetByIdAsync(int id);
    Task<ApiResponse<ProductResponseModel>> CreateAsync(ProductEntity entity);
    Task<ApiResponse<ProductResponseModel>> UpdateAsync(int id, ProductEntity entity);
    Task<ApiResponse<bool>> DeleteAsync(int id);
    Task<ApiResponse<IEnumerable<ProductResponseModel>>> SearchAsync(string keyword);
    Task<ApiResponse<IEnumerable<ProductResponseModel>>> FilterAsync(int? categoryId, int? supplierId);
}
