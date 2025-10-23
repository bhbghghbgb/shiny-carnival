using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface IProductService : IBaseService<ProductEntity, int>
{
    Task<ApiResponse<IEnumerable<ProductEntity>>> SearchAsync(string keyword);
    Task<ApiResponse<IEnumerable<ProductEntity>>> FilterAsync(int? categoryId, int? supplierId);
}
