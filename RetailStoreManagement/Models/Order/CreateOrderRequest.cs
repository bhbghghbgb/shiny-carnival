using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Order;

public class CreateOrderRequest
{
    [Required]
    public int CustomerId { get; set; }

    [MaxLength(MAX_LENGTH_CODE)]
    public string? PromoCode { get; set; }

    [Required]
    [MinLength(MIN_QUANTITY, ErrorMessage = "Order must have at least one item.")]
    public List<OrderItemInput> OrderItems { get; set; } = new();
}
