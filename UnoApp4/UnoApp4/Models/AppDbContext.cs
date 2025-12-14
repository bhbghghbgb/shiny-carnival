using Microsoft.EntityFrameworkCore;

namespace UnoApp4.Models;

public class AppDbContext : DbContext
{
    public DbSet<CartItem> CartItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string databasePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "unoapp.db");
        optionsBuilder.UseSqlite($"Data Source={databasePath}");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasIndex(e => e.ProductId);
        });
    }
}
