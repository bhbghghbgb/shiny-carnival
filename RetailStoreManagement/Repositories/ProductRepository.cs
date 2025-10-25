using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Repositories;

public class ProductRepository : Repository<ProductEntity, int>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context) { }

    // ====================================================
    // Lấy danh sách có chứa Category, Supplier, Inventory 
    // (dùng cho phân trang, lọc, hoặc tìm kiếm)
    // ====================================================
    public override IQueryable<ProductEntity> GetQueryable()
    {
        return _dbSet
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .Where(p => p.DeletedAt == null)
            .AsNoTracking();
    }

    // ===============================================
    // Lấy theo ID bao gồm đầy đủ thông tin liên quan.
    // ===============================================
    public override async Task<ProductEntity?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);
    }

    // =========================================
    // Tìm kiếm theo tên hoặc mã vạch.
    // =========================================
    public async Task<IEnumerable<ProductEntity>> SearchAsync(string keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return await GetQueryable().ToListAsync();
        }

        keyword = keyword.Trim().ToLower();

        return await GetQueryable()
            .Where(p =>
                p.ProductName.ToLower().Contains(keyword) ||
                (p.Barcode != null && p.Barcode.ToLower().Contains(keyword))
            )
            .ToListAsync();
    }

    // =========================================
    // Lọc theo danh mục và/hoặc nhà cung cấp.
    // =========================================
    public async Task<IEnumerable<ProductEntity>> FilterAsync(int? categoryId, int? supplierId)
    {
        var query = GetQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (supplierId.HasValue)
            query = query.Where(p => p.SupplierId == supplierId.Value);

        return await query.ToListAsync();
    }
}
