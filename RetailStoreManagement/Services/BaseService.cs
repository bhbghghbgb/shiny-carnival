using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

public class BaseService<TEntity, TKey> : IBaseService<TEntity, TKey> 
    where TEntity : BaseEntity<TKey>
{
    protected readonly IRepository<TEntity, TKey> _repository;

    public BaseService(IRepository<TEntity, TKey> repository)
    {
        _repository = repository;
    }

    public virtual async Task<ApiResponse<TEntity>> GetByIdAsync(TKey id)
    {
    var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<TEntity>.Fail("Entity not found");

        return ApiResponse<TEntity>.Success(entity);
    }

    public virtual async Task<ApiResponse<IPagedList<TEntity>>> GetPagedAsync(PagedRequest request)
    {
        var result = await _repository.GetPagedAsync(request);
        return ApiResponse<IPagedList<TEntity>>.Success(result);
    }

    public virtual async Task<ApiResponse<TEntity>> CreateAsync(TEntity entity)
    {
        var created = await _repository.AddAsync(entity);
        return ApiResponse<TEntity>.Success(created, "Created successfully");
    }

    public virtual async Task<ApiResponse<TEntity>> UpdateAsync(TKey id, TEntity entity)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return ApiResponse<TEntity>.Fail("Entity not found");

        entity.Id = id;
        await _repository.UpdateAsync(entity);
        return ApiResponse<TEntity>.Success(entity, "Updated successfully");
    }

    public virtual async Task<ApiResponse<bool>> DeleteAsync(TKey id)
    {
        await _repository.SoftDeleteAsync(id);
        return ApiResponse<bool>.Success(true, "Deleted successfully");
    }
}
