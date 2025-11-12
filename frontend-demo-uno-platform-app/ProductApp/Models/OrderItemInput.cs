using System.ComponentModel.DataAnnotations;

namespace ProductApp.Models;

public class OrderItemInput
{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
}
