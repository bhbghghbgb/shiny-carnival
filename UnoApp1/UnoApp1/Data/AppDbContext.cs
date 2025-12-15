using Microsoft.EntityFrameworkCore;
using UnoApp1.Data.Entities;

namespace UnoApp1.Data;

public class AppDbContext : DbContext
{
    public DbSet<CartItem> CartItems { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string databasePath = Path.Combine(
            ApplicationData.Current.LocalFolder.Path,
            "UnoApp1.db");

        // Create directory if it doesn't exist
        var directory = Path.GetDirectoryName(databasePath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

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

    public async Task InitializeAsync()
    {
        try
        {
            await Database.EnsureCreatedAsync();
            System.Diagnostics.Debug.WriteLine("Database initialized successfully");
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Database initialization failed: {ex.Message}");
        }
    }
}
