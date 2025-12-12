using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Inventory;

public class UpdateInventoryRequest
{
    [Required]
    public int QuantityChange { get; set; } // Positive to increase, negative to decrease

    [Required]
    [MaxLength(255)]
    public string Reason { get; set; } = string.Empty;
}
