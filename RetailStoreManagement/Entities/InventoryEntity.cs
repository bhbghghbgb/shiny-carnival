using System.ComponentModel.DataAnnotations;


namespace RetailStoreManagement.Entities;

public class InventoryEntity : BaseEntity<int>
{
    [Required]
    public int ProductId { get; set; }

    public int Quantity { get; set; } = 0;

    // Navigation properties
    public virtual ProductEntity Product { get; set; } = null!;
}