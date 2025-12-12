using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Models.Report;

public class PromotionEffectivenessDto
{
    public int PromoId { get; set; }
    public string PromoCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public PromotionStatus Status { get; set; }
    public int UsedCount { get; set; }
    public int UsageLimit { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalDiscountAmount { get; set; }
    public decimal ConversionRate { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
}