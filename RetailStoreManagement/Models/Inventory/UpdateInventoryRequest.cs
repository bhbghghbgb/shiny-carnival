using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Inventory;

public class UpdateInventoryRequest
{
    public int? QuantityChange { get; set; } // Positive to increase, negative to decrease

    [MaxLength(255)]
    public string? Reason { get; set; }
}
