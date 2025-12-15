using System.ComponentModel.DataAnnotations;


namespace RetailStoreManagement.Entities;

public class InventoryHistoryEntity : BaseEntity<int>
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int QuantityChange { get; set; }

    [Required]
    public int QuantityAfter { get; set; }

    [Required]
    [MaxLength(255)]
    public string Reason { get; set; } = string.Empty;

    // Navigation properties
    public virtual ProductEntity Product { get; set; } = null!;

    public virtual UserEntity User { get; set; } = null!;
}
