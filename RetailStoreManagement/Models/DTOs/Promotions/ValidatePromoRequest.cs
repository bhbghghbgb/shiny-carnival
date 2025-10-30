using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Promotions;

public class ValidatePromoRequest
{
    [Required]
    [MaxLength(50)]
    public string PromoCode { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal OrderAmount { get; set; }
}
