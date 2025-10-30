using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Inventory;

public class UpdateInventoryRequest
{
    [Required]
    public int QuantityChange { get; set; }

    [Required]
    [MaxLength(255)]
    public string Reason { get; set; } = string.Empty;
}
