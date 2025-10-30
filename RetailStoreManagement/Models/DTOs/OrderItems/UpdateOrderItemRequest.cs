using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.OrderItems;

public class UpdateOrderItemRequest
{
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
