using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<UserEntity, int> Users { get; }
    IRepository<CustomerEntity, int> Customers { get; }
    IRepository<CategoryEntity, int> Categories { get; }
    IRepository<SupplierEntity, int> Suppliers { get; }
    IRepository<ProductEntity, int> Products { get; }
    IRepository<InventoryEntity, int> Inventory { get; }
    IRepository<PromotionEntity, int> Promotions { get; }
    IRepository<OrderEntity, int> Orders { get; }
    IRepository<OrderItemEntity, int> OrderItems { get; }
    IRepository<PaymentEntity, int> Payments { get; }
    IRepository<InventoryHistoryEntity, int> InventoryHistories { get; }
    IRepository<UserRefreshToken, Guid> UserRefreshTokens { get; }
    
    Task<int> SaveChangesAsync();
}