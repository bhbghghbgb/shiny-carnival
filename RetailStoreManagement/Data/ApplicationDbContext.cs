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
    public DbSet<InventoryHistoryEntity> InventoryHistories { get; set; }
    public DbSet<UserRefreshToken> UserRefreshTokens { get; set; }

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

        ConfigureUserRefreshTokenRelationships(modelBuilder);
        ConfigureInventoryHistoryRelationships(modelBuilder);

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
        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.ToTable("Users");

            entity.Property(e => e.Username).HasColumnName("username");
            entity.Property(e => e.Password).HasColumnName("password");
            entity.Property(e => e.FullName).HasColumnName("full_name");
            entity.Property(e => e.Role).HasColumnName("role");

            entity.HasIndex(e => e.Username).IsUnique();

            entity.HasMany(u => u.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureCustomerRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CustomerEntity>(entity =>
        {
            entity.ToTable("Customers");

            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Phone).HasColumnName("phone");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Address).HasColumnName("address");

            entity.HasMany(c => c.Orders)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureCategoryRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoryEntity>(entity =>
        {
            entity.ToTable("Categories");

            entity.Property(e => e.CategoryName).HasColumnName("category_name");

            entity.HasMany(c => c.Products)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureSupplierRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SupplierEntity>(entity =>
        {
            entity.ToTable("Suppliers");

            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Phone).HasColumnName("phone");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Address).HasColumnName("address");

            entity.HasMany(s => s.Products)
                .WithOne(p => p.Supplier)
                .HasForeignKey(p => p.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureProductRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductEntity>(entity =>
        {
            entity.ToTable("Products");

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.SupplierId).HasColumnName("supplier_id");
            entity.Property(e => e.ProductName).HasColumnName("product_name");
            entity.Property(e => e.Barcode).HasColumnName("barcode");
            entity.Property(e => e.Price).HasColumnName("price").HasColumnType("decimal(10,2)");
            entity.Property(e => e.Unit).HasColumnName("unit");
            entity.Property(e => e.ImageUrl).HasColumnName("image_url");
            entity.Property(e => e.ImageFileId).HasColumnName("image_file_id");

            entity.HasIndex(e => e.Barcode).IsUnique();

            entity.HasOne(p => p.Inventory)
                .WithOne(i => i.Product)
                .HasForeignKey<InventoryEntity>(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.OrderItems)
                .WithOne(oi => oi.Product)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureInventoryRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InventoryEntity>(entity =>
        {
            entity.ToTable("Inventory");

            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
        });
    }

    private static void ConfigurePromotionRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PromotionEntity>(entity =>
        {
            entity.ToTable("Promotions");

            entity.Property(e => e.PromoCode).HasColumnName("promo_code");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.DiscountType).HasColumnName("discount_type");
            entity.Property(e => e.DiscountValue).HasColumnName("discount_value").HasColumnType("decimal(10,2)");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.MinOrderAmount).HasColumnName("min_order_amount").HasColumnType("decimal(10,2)");
            entity.Property(e => e.UsageLimit).HasColumnName("usage_limit");
            entity.Property(e => e.UsedCount).HasColumnName("used_count");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasIndex(e => e.PromoCode).IsUnique();

            entity.HasMany(p => p.Orders)
                .WithOne(o => o.Promotion)
                .HasForeignKey(o => o.PromoId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }

    private static void ConfigureOrderRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderEntity>(entity =>
        {
            entity.ToTable("Orders");

            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.PromoId).HasColumnName("promo_id");
            entity.Property(e => e.OrderDate).HasColumnName("order_date");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.TotalAmount).HasColumnName("total_amount").HasColumnType("decimal(10,2)");
            entity.Property(e => e.DiscountAmount).HasColumnName("discount_amount").HasColumnType("decimal(10,2)");

            entity.HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(o => o.Payments)
                .WithOne(p => p.Order)
                .HasForeignKey(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureOrderItemRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderItemEntity>(entity =>
        {
            entity.ToTable("OrderItems");

            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Price).HasColumnName("price").HasColumnType("decimal(10,2)");
            entity.Property(e => e.Subtotal).HasColumnName("subtotal").HasColumnType("decimal(10,2)");
        });
    }

    private static void ConfigurePaymentRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PaymentEntity>(entity =>
        {
            entity.ToTable("Payments");

            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.Amount).HasColumnName("amount").HasColumnType("decimal(10,2)");
            entity.Property(e => e.PaymentMethod).HasColumnName("payment_method");
            entity.Property(e => e.PaymentDate).HasColumnName("payment_date");
        });
    }

    private static void ConfigureInventoryHistoryRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InventoryHistoryEntity>(entity =>
        {
            entity.ToTable("InventoryHistories");

            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.QuantityChange).HasColumnName("quantity_change");
            entity.Property(e => e.QuantityAfter).HasColumnName("quantity_after");
            entity.Property(e => e.Reason).HasColumnName("reason");

            entity.HasOne(ih => ih.Product)
                .WithMany()
                .HasForeignKey(ih => ih.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ih => ih.User)
                .WithMany()
                .HasForeignKey(ih => ih.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureUserRefreshTokenRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRefreshToken>(entity =>
        {
            entity.ToTable("UserRefreshTokens");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Token).HasColumnName("token");
            entity.Property(e => e.ExpiresAt).HasColumnName("expires_at");
            entity.Property(e => e.IsRevoked).HasColumnName("is_revoked");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");

            entity.HasOne(urt => urt.User)
                .WithMany(u => u.UserRefreshTokens)
                .HasForeignKey(urt => urt.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
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