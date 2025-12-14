using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Order;

public class OrderItemInput
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(MIN_QUANTITY, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
}
