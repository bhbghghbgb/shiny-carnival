using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailStoreManagement.Entities;

public class ProductEntity : BaseEntity<int>
{
    [Required]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Required]
    [Column("supplier_id")]
    public int SupplierId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("product_name")]
    public string ProductName { get; set; } = string.Empty;

    [MaxLength(50)]
    [Column("barcode")]
    public string? Barcode { get; set; }

    [Required]
    [Column("price", TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    [MaxLength(20)]
    [Column("unit")]
    public string Unit { get; set; } = "pcs";

    // Navigation properties
    [ForeignKey("CategoryId")]
    public virtual CategoryEntity Category { get; set; } = null!;

    [ForeignKey("SupplierId")]
    public virtual SupplierEntity Supplier { get; set; } = null!;

    public virtual InventoryEntity? Inventory { get; set; }
    public virtual ICollection<OrderItemEntity> OrderItems { get; set; } = new List<OrderItemEntity>();
}