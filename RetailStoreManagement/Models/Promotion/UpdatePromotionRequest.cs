using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Promotion;

public class UpdatePromotionRequest
{
    [MaxLength(MAX_LENGTH_CODE)]
    public string? PromoCode { get; set; }

    [MaxLength(MAX_LENGTH_DESCRIPTION)]
    public string? Description { get; set; }

    [RegularExpression("^(percent|fixed)$", ErrorMessage = "Discount type must be 'percent' or 'fixed'")]
    public string? DiscountType { get; set; }

    [Range((double)MIN_PRICE, double.MaxValue, ErrorMessage = "Discount value must be greater than 0")]
    public decimal? DiscountValue { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MinOrderAmount { get; set; }

    [Range(MIN_USAGE_LIMIT, int.MaxValue, ErrorMessage = "Usage limit must be at least 1")]
    public int? UsageLimit { get; set; }

    [RegularExpression("^(active|inactive)$", ErrorMessage = "Status must be 'active' or 'inactive'")]
    public string? Status { get; set; }
}
