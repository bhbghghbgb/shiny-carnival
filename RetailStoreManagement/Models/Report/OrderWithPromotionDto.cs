namespace RetailStoreManagement.Models.Report;

public class OrderWithPromotionDto
{
    public int OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public string OrderStatus { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal FinalAmount { get; set; }
    public int? PromoId { get; set; }
    public string PromoCode { get; set; } = string.Empty;
    public string DiscountType { get; set; } = string.Empty;
    public decimal DiscountValue { get; set; }
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
}