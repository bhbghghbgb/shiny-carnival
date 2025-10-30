using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Orders;

public class CreateOrderRequest
{
    [Required]
    public int CustomerId { get; set; }

    [MaxLength(50)]
    public string? PromoCode { get; set; }

    [Required]
    [MinLength(1)]
    public List<OrderItemInput> OrderItems { get; set; } = new();
}
