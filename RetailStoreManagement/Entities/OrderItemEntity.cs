using System.ComponentModel.DataAnnotations;


namespace RetailStoreManagement.Entities;

public class OrderItemEntity : BaseEntity<int>
{
    [Required]
    public int OrderId { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public decimal Price { get; set; }

    [Required]
    public decimal Subtotal { get; set; }

    // Navigation properties
    public virtual OrderEntity Order { get; set; } = null!;

    public virtual ProductEntity Product { get; set; } = null!;
}