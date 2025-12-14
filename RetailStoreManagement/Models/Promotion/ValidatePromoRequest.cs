using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Promotion;

public class ValidatePromoRequest
{
    [Required]
    public string PromoCode { get; set; } = string.Empty;

    [Required]
    [Range((double)MIN_PRICE, double.MaxValue)]
    public decimal OrderAmount { get; set; }
}
