using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailStoreManagement.Entities;

public class InventoryHistoryEntity : BaseEntity<int>
{
    [Required]
    [Column("product_id")]
    public int ProductId { get; set; }

    [Required]
    [Column("quantity_change")]
    public int QuantityChange { get; set; }

    [Required]
    [Column("quantity_after")]
    public int QuantityAfter { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("reason")]
    public string Reason { get; set; } = string.Empty;

    [Required]
    [Column("user_id")]
    public int UserId { get; set; }

    // Navigation properties
    [ForeignKey("ProductId")]
    public virtual ProductEntity Product { get; set; } = null!;

    [ForeignKey("UserId")]
    public virtual UserEntity User { get; set; } = null!;
}
