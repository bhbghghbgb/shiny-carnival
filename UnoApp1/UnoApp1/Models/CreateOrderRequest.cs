using System.ComponentModel.DataAnnotations;

namespace UnoApp1.Models;

public class CreateOrderRequest
{
    [Required]
    public int CustomerId { get; set; }

    [MaxLength(50)]
    public string? PromoCode { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Order must have at least one item.")]
    public List<OrderItemInput> OrderItems { get; set; } = new();
}
