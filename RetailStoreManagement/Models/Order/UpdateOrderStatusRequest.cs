using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Order;

public class UpdateOrderStatusRequest
{
    [RegularExpression("^(pending|paid|canceled)$", ErrorMessage = "Status must be 'pending', 'paid', or 'canceled'")]
    public string? Status { get; set; }
}
