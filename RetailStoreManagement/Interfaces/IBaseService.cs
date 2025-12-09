using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Interfaces;

public interface IBaseService<TEntity, TKey> where TEntity : BaseEntity<TKey>
{
    Task<ApiResponse<TEntity>> GetByIdAsync(TKey id);
    Task<ApiResponse<IPagedList<TEntity>>> GetPagedAsync(PagedRequest request);
    Task<ApiResponse<TEntity>> CreateAsync(TEntity entity);
    Task<ApiResponse<TEntity>> UpdateAsync(TKey id, TEntity entity);
    Task<ApiResponse<bool>> DeleteAsync(TKey id);
}