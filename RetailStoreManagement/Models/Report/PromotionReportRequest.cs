namespace RetailStoreManagement.Models.Report;

public class PromotionReportRequest
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? PromoId { get; set; }
    public bool IncludeOrderDetails { get; set; } = false;
}