namespace RetailStoreManagement.Models.Report;

public class PromotionReportDto
{
    public List<PromotionEffectivenessDto> PromotionEffectiveness { get; set; } = new();
    public List<OrderWithPromotionDto> OrdersWithPromotion { get; set; } = new();
    public PromotionReportSummaryDto Summary { get; set; } = new();
}

public class PromotionReportSummaryDto
{
    public int TotalPromotions { get; set; }
    public int ActivePromotions { get; set; }
    public int TotalOrdersWithPromotion { get; set; }
    public decimal TotalRevenueFromPromotions { get; set; }
    public decimal TotalDiscountGiven { get; set; }
    public decimal AverageDiscountRate { get; set; }
}