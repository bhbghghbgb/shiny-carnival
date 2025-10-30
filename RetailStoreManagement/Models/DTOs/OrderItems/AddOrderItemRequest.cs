using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.OrderItems;

public class AddOrderItemRequest
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
