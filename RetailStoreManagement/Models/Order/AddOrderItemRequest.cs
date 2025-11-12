using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class AddOrderItemRequest
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
}
