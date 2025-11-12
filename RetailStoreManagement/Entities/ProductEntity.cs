using System.ComponentModel.DataAnnotations;


namespace RetailStoreManagement.Entities;

public class ProductEntity : BaseEntity<int>
{
    [Required]
    public int CategoryId { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Barcode { get; set; } = string.Empty;

    [Required]
    public decimal Price { get; set; }

    [MaxLength(20)]
    public string Unit { get; set; } = "pcs";

    // Navigation properties
    public virtual CategoryEntity Category { get; set; } = null!;

    public virtual SupplierEntity Supplier { get; set; } = null!;

    public virtual InventoryEntity? Inventory { get; set; }
    public virtual ICollection<OrderItemEntity> OrderItems { get; set; } = new List<OrderItemEntity>();
}