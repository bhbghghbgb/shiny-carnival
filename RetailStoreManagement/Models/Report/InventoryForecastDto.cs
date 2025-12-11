namespace RetailStoreManagement.Models.Report;

public class InventoryForecastDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
    public int CurrentQuantity { get; set; }
    public decimal AverageMonthlySales { get; set; }
    public decimal AverageDailySales { get; set; }
    public int TotalSoldInPeriod { get; set; }
    public int MonthsAnalyzed { get; set; }
    public int ForecastedDaysRemaining { get; set; }
    public int RecommendedOrderQuantity { get; set; }
    public decimal EstimatedCost { get; set; }
    public string StockStatus { get; set; } = string.Empty;
    public bool NeedsReorder { get; set; }
    public string Recommendation { get; set; } = string.Empty;
}
