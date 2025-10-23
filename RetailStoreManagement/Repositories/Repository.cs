using System.Linq.Expressions;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Repositories;

public class Repository<TEntity, TKey> : IRepository<TEntity, TKey>
    where TEntity : BaseEntity<TKey>
{
    protected readonly ApplicationDbContext _context;
    protected readonly DbSet<TEntity> _dbSet;

    public Repository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    // ✅ Lấy theo ID, sử dụng global query filter để bỏ qua bản ghi đã xóa
    public virtual async Task<TEntity?> GetByIdAsync(TKey id)
    {
        return await _dbSet.FirstOrDefaultAsync(e => e.Id.Equals(id));
    }

    public virtual async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<IPagedList<TEntity>> GetPagedAsync(PagedRequest request)
    {
        var query = _dbSet.AsQueryable();

        // Search nếu có
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = ApplySearch(query, request.Search);

        // Sorting nếu có
        query = ApplySorting(query, request.SortBy, request.SortDesc);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new PagedList<TEntity>(items, totalCount, request.Page, request.PageSize);
    }

    public virtual IQueryable<TEntity> GetQueryable() => _dbSet.AsQueryable();

    public virtual async Task<TEntity> AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task UpdateAsync(TEntity entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public virtual async Task DeleteAsync(TKey id)
    {
        var entity = await _dbSet.FirstOrDefaultAsync(e => e.Id.Equals(id));
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public virtual async Task SoftDeleteAsync(TKey id)
    {
        var entity = await _dbSet.FirstOrDefaultAsync(e => e.Id.Equals(id));
        if (entity != null)
        {
            entity.DeletedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    protected virtual IQueryable<TEntity> ApplySearch(IQueryable<TEntity> query, string search)
    {
        return query; // override trong subclass
    }

    protected virtual IQueryable<TEntity> ApplySorting(IQueryable<TEntity> query, string sortBy, bool sortDesc)
    {
        if (string.IsNullOrWhiteSpace(sortBy))
            return query;

        var property = typeof(TEntity).GetProperty(sortBy, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
        if (property != null)
        {
            var parameter = Expression.Parameter(typeof(TEntity), "x");
            var propertyAccess = Expression.Property(parameter, property);
            var orderByExp = Expression.Lambda(propertyAccess, parameter);

            string methodName = sortDesc ? "OrderByDescending" : "OrderBy";
            Type[] types = { typeof(TEntity), property.PropertyType };
            var resultExp = Expression.Call(typeof(Queryable), methodName, types, query.Expression, Expression.Quote(orderByExp));
            query = query.Provider.CreateQuery<TEntity>(resultExp);
        }

        return query;
    }
}
