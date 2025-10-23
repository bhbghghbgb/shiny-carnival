using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<UserEntity> Users { get; set; }
    public DbSet<CustomerEntity> Customers { get; set; }
    public DbSet<CategoryEntity> Categories { get; set; }
    public DbSet<SupplierEntity> Suppliers { get; set; }
    public DbSet<ProductEntity> Products { get; set; }
    public DbSet<InventoryEntity> Inventory { get; set; }
    public DbSet<PromotionEntity> Promotions { get; set; }
    public DbSet<OrderEntity> Orders { get; set; }
    public DbSet<OrderItemEntity> OrderItems { get; set; }
    public DbSet<PaymentEntity> Payments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Disabled lazy loading to prevent circular reference issues
        // optionsBuilder.UseLazyLoadingProxies();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        ConfigureUserRelationships(modelBuilder);
        ConfigureCustomerRelationships(modelBuilder);
        ConfigureCategoryRelationships(modelBuilder);
        ConfigureSupplierRelationships(modelBuilder);
        ConfigureProductRelationships(modelBuilder);
        ConfigureInventoryRelationships(modelBuilder);
        ConfigurePromotionRelationships(modelBuilder);
        ConfigureOrderRelationships(modelBuilder);
        ConfigureOrderItemRelationships(modelBuilder);
        ConfigurePaymentRelationships(modelBuilder);

        // Configure soft delete global query filter
        ConfigureSoftDelete(modelBuilder);
    }

    private static void ConfigureSoftDelete(ModelBuilder modelBuilder)
    {
        // This correct logic generates the required 'e => e.DeletedAt == null' expression 
        // for all entities inheriting from BaseEntity<int> or similar base.
        var baseEntityType = typeof(BaseEntity<int>);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
                     .Where(e => baseEntityType.IsAssignableFrom(e.ClrType)))
        {
            var parameter = Expression.Parameter(entityType.ClrType, "e");
            var property = Expression.Property(parameter, "DeletedAt");
            var nullValue = Expression.Constant(null, typeof(DateTime?));
            var equals = Expression.Equal(property, nullValue);
            var lambda = Expression.Lambda(equals, parameter);

            modelBuilder.Entity(entityType.ClrType)
                .HasQueryFilter(lambda);
        }
    }

    private static void ConfigureUserRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>()
            .HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureCustomerRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CustomerEntity>()
            .HasMany(c => c.Orders)
            .WithOne(o => o.Customer)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureCategoryRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoryEntity>()
            .HasMany(c => c.Products)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureSupplierRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SupplierEntity>()
            .HasMany(s => s.Products)
            .WithOne(p => p.Supplier)
            .HasForeignKey(p => p.SupplierId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureProductRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductEntity>()
            .HasOne(p => p.Inventory)
            .WithOne(i => i.Product)
            .HasForeignKey<InventoryEntity>(i => i.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProductEntity>()
            .HasMany(p => p.OrderItems)
            .WithOne(oi => oi.Product)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static void ConfigureInventoryRelationships(ModelBuilder modelBuilder)
    {
        // Already configured in ProductRelationships
    }

    private static void ConfigurePromotionRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PromotionEntity>()
            .HasMany(p => p.Orders)
            .WithOne(o => o.Promotion)
            .HasForeignKey(o => o.PromoId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureOrderRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderEntity>()
            .HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderEntity>()
            .HasMany(o => o.Payments)
            .WithOne(p => p.Order)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureOrderItemRelationships(ModelBuilder modelBuilder)
    {
        // Already configured in OrderRelationships and ProductRelationships
    }

    private static void ConfigurePaymentRelationships(ModelBuilder modelBuilder)
    {
        // Already configured in OrderRelationships
    }

    public override int SaveChanges()
    {
        UpdateAuditFields();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuditFields()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e is { Entity: BaseEntity<int>, State: EntityState.Added or EntityState.Modified });

        foreach (var entry in entries)
        {
            var auditableEntity = (BaseEntity<int>)entry.Entity;

            switch (entry.State)
            {
                case EntityState.Added:
                    auditableEntity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    auditableEntity.UpdatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Detached:
                case EntityState.Unchanged:
                case EntityState.Deleted:
                default:
                    break;
            }
        }
    }
}