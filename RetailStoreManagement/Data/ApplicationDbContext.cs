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
    public DbSet<InventoryEntity> Inventories { get; set; }
    public DbSet<InventoryHistoryEntity> InventoryHistories { get; set; }
    public DbSet<PromotionEntity> Promotions { get; set; }
    public DbSet<OrderEntity> Orders { get; set; }
    public DbSet<OrderItemEntity> OrderItems { get; set; }
    public DbSet<PaymentEntity> Payments { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseLazyLoadingProxies();
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

        // Configure unique constraints and indexes
        ConfigureUniqueConstraintsAndIndexes(modelBuilder);

        // Configure soft delete global query filter
        ConfigureSoftDelete(modelBuilder);

        // Seed initial data
        SeedData(modelBuilder);
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
        
        // Configure InventoryHistory relationships
        modelBuilder.Entity<InventoryHistoryEntity>()
            .HasOne(ih => ih.Product)
            .WithMany()
            .HasForeignKey(ih => ih.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<InventoryHistoryEntity>()
            .HasOne(ih => ih.User)
            .WithMany()
            .HasForeignKey(ih => ih.UserId)
            .OnDelete(DeleteBehavior.Restrict);
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

    private static void ConfigureUniqueConstraintsAndIndexes(ModelBuilder modelBuilder)
    {
        // Unique constraints
        modelBuilder.Entity<UserEntity>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<ProductEntity>()
            .HasIndex(p => p.Barcode)
            .IsUnique();

        modelBuilder.Entity<PromotionEntity>()
            .HasIndex(p => p.PromoCode)
            .IsUnique();

        // Performance indexes
        modelBuilder.Entity<OrderEntity>()
            .HasIndex(o => o.OrderDate);

        modelBuilder.Entity<OrderEntity>()
            .HasIndex(o => o.Status);

        modelBuilder.Entity<ProductEntity>()
            .HasIndex(p => p.ProductName);

        modelBuilder.Entity<CustomerEntity>()
            .HasIndex(c => c.Phone);

        modelBuilder.Entity<InventoryEntity>()
            .HasIndex(i => i.Quantity);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seed default admin user
        modelBuilder.Entity<UserEntity>().HasData(
            new UserEntity
            {
                Id = 1,
                Username = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
                FullName = "System Administrator",
                Role = Enums.UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            }
        );

        // Seed default categories
        modelBuilder.Entity<CategoryEntity>().HasData(
            new CategoryEntity { Id = 1, CategoryName = "Electronics", CreatedAt = DateTime.UtcNow },
            new CategoryEntity { Id = 2, CategoryName = "Clothing", CreatedAt = DateTime.UtcNow },
            new CategoryEntity { Id = 3, CategoryName = "Food & Beverages", CreatedAt = DateTime.UtcNow },
            new CategoryEntity { Id = 4, CategoryName = "Home & Garden", CreatedAt = DateTime.UtcNow },
            new CategoryEntity { Id = 5, CategoryName = "Books", CreatedAt = DateTime.UtcNow }
        );
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