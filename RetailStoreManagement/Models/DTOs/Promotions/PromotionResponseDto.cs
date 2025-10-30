namespace RetailStoreManagement.Models.DTOs.Promotions;

public class PromotionResponseDto
{
    public int Id { get; set; }
    public string PromoCode { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int UsageLimit { get; set; }
    public int UsedCount { get; set; }
    public int RemainingUsage { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
