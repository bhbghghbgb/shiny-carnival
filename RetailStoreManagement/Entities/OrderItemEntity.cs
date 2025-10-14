using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RetailStoreManagement.Entities;

public class OrderItemEntity : BaseEntity<int>
{
    [Required]
    [Column("order_id")]
    public int OrderId { get; set; }

    [Required]
    [Column("product_id")]
    public int ProductId { get; set; }

    [Required]
    [Column("quantity")]
    public int Quantity { get; set; }

    [Required]
    [Column("price", TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    [Required]
    [Column("subtotal", TypeName = "decimal(10,2)")]
    public decimal Subtotal { get; set; }

    // Navigation properties
    [ForeignKey("OrderId")]
    public virtual OrderEntity Order { get; set; } = null!;

    [ForeignKey("ProductId")]
    public virtual ProductEntity Product { get; set; } = null!;
}