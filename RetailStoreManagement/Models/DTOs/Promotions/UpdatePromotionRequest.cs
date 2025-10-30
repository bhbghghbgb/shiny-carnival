using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Promotions;

public class UpdatePromotionRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string PromoCode { get; set; } = string.Empty;

    [MaxLength(255)]
    public string? Description { get; set; }

    [Required]
    [RegularExpression("^(percent|fixed)$", ErrorMessage = "DiscountType must be 'percent' or 'fixed'")]
    public string DiscountType { get; set; } = string.Empty;

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal DiscountValue { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal MinOrderAmount { get; set; } = 0;

    [Range(0, int.MaxValue)]
    public int UsageLimit { get; set; } = 0;

    [Required]
    [RegularExpression("^(active|inactive)$", ErrorMessage = "Status must be 'active' or 'inactive'")]
    public string Status { get; set; } = "active";
}
