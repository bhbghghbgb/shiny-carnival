using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Repositories;

public class ProductRepository : Repository<ProductEntity, int>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context) { }

    // ========================================================================
    // Lấy sản phẩm theo ID (bao gồm cả category, supplier, inventory)
    // ========================================================================
    public override async Task<ProductEntity?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);
    }
    
    // ========================================================================
    // Override GetPagedAsync để include các related entities
    // ========================================================================
    public override async Task<IPagedList<ProductEntity>> GetPagedAsync(PagedRequest request)
    {
        var query = _dbSet
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .AsQueryable();

        // Search nếu có
        if (!string.IsNullOrWhiteSpace(request.Search))
            query = ApplySearch(query, request.Search);

        // Sorting nếu có
        query = ApplySorting(query, request.SortBy, request.SortDesc);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return new PagedList<ProductEntity>(items, totalCount, request.Page, request.PageSize);
    }

    // ========================================================================
    // Tìm kiếm sản phẩm theo tên hoặc mã vạch
    // ========================================================================
    public async Task<IEnumerable<ProductEntity>> SearchByNameOrBarcodeAsync(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return await _dbSet
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .AsNoTracking()
                .ToListAsync();
        }

        keyword = keyword.Trim().ToLower();

        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Where(p =>
                p.ProductName.ToLower().Contains(keyword) ||
                (p.Barcode != null && p.Barcode.ToLower().Contains(keyword))
            )
            .AsNoTracking()
            .ToListAsync();
    }

    // ========================================================================
    // Lọc sản phẩm theo danh mục và nhà cung cấp (category và supplier)
    // ========================================================================
    public async Task<IEnumerable<ProductEntity>> FilterByCategoryAndSupplierAsync(int? categoryId, int? supplierId)
    {
        var query = _dbSet
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (supplierId.HasValue)
            query = query.Where(p => p.SupplierId == supplierId.Value);

        return await query.AsNoTracking().ToListAsync();
    }

    // ========================================================================
    // ApplySearch (phục vụ cho phân trang)
    // ========================================================================
    protected override IQueryable<ProductEntity> ApplySearch(IQueryable<ProductEntity> query, string search)
    {
        search = search.Trim().ToLower();
        return query.Where(p =>
            p.ProductName.ToLower().Contains(search) ||
            (p.Barcode != null && p.Barcode.ToLower().Contains(search))
        );
    }
}
