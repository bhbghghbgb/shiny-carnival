using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class UpdateOrderStatusRequest
{
    [Required]
    [RegularExpression("^(paid|canceled)$", ErrorMessage = "Status must be 'paid' or 'canceled'")]
    public string Status { get; set; } = string.Empty;
}
