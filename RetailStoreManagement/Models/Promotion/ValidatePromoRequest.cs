using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Promotion;

public class ValidatePromoRequest
{
    [Required]
    public string PromoCode { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal OrderAmount { get; set; }
}
