using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Repositories;

namespace RetailStoreManagement.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
        Users = new Repository<UserEntity, int>(context);
        Customers = new Repository<CustomerEntity, int>(context);
        Categories = new Repository<CategoryEntity, int>(context);
        Suppliers = new Repository<SupplierEntity, int>(context);
        Products = new Repository<ProductEntity, int>(context);
        Inventory = new Repository<InventoryEntity, int>(context);
        Promotions = new Repository<PromotionEntity, int>(context);
        Orders = new Repository<OrderEntity, int>(context);
        OrderItems = new Repository<OrderItemEntity, int>(context);
        Payments = new Repository<PaymentEntity, int>(context);
    }

    public IRepository<UserEntity, int> Users { get; }
    public IRepository<CustomerEntity, int> Customers { get; }
    public IRepository<CategoryEntity, int> Categories { get; }
    public IRepository<SupplierEntity, int> Suppliers { get; }
    public IRepository<ProductEntity, int> Products { get; }
    public IRepository<InventoryEntity, int> Inventory { get; }
    public IRepository<PromotionEntity, int> Promotions { get; }
    public IRepository<OrderEntity, int> Orders { get; }
    public IRepository<OrderItemEntity, int> OrderItems { get; }
    public IRepository<PaymentEntity, int> Payments { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}