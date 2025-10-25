using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Entities;

public class ProductEntity : BaseEntity<int>
{
    [Required]
    [MaxLength(100)]
    [Column("product_name")]
    public string ProductName { get; set; } = string.Empty;
    
    [Required]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Required]
    [Column("supplier_id")]
    public int SupplierId { get; set; }

    [MaxLength(50)]
    [Column("barcode")]
    public string? Barcode { get; set; }

    [Required]
    [Column("price", TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    [MaxLength(20)]
    [Column("unit")]
    public ProductUnit Unit { get; set; } = ProductUnit.Pcs;

    // Navigation properties
    [ForeignKey("CategoryId")]
    public virtual CategoryEntity Category { get; set; } = null!; // (1-n)

    [ForeignKey("SupplierId")]
    public virtual SupplierEntity Supplier { get; set; } = null!; // (1-n)

    public virtual InventoryEntity? Inventory { get; set; } // (1-1)
    public virtual ICollection<OrderItemEntity> OrderItems { get; set; } = new List<OrderItemEntity>(); // (n-n)
}