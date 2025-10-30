using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Orders;

public class OrderItemInput
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
