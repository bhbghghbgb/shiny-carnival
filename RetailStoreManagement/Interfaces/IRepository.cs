using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface IRepository<TEntity, TKey> where TEntity : BaseEntity<TKey>
{
    Task<TEntity?> GetByIdAsync(TKey id);
    Task<IEnumerable<TEntity>> GetAllAsync();
    Task<IPagedList<TEntity>> GetPagedAsync(PagedRequest request);
    Task<TEntity> AddAsync(TEntity entity);
    Task UpdateAsync(TEntity entity);
    Task DeleteAsync(TKey id);
    Task SoftDeleteAsync(TKey id);
    IQueryable<TEntity> GetQueryable();
}