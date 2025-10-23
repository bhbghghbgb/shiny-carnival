using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailStoreManagement.Entities;

public class InventoryEntity : BaseEntity<int>
{
    [Required]
    [Column("product_id")]
    public int ProductId { get; set; }

    [Column("quantity")]
    public int Quantity { get; set; } = 0;

    // Navigation properties
    [ForeignKey("ProductId")]
    public virtual ProductEntity Product { get; set; } = null!; // (1-1)
}