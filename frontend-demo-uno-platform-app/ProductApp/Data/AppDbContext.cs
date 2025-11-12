using Microsoft.EntityFrameworkCore;
using ProductApp.Data.Entities;

namespace ProductApp.Data;

public class AppDbContext : DbContext
{
    public DbSet<CartItem> CartItems { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string databasePath = Path.Combine(FileSystem.AppDataDirectory, "productapp.db3");
        optionsBuilder.UseSqlite($"Data Source={databasePath}");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProductName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.CategoryName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.Property(e => e.AddedAt).IsRequired();
        });
    }
}
