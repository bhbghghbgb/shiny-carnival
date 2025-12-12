namespace RetailStoreManagement.Models.Report;

public class InventoryForecastReportDto
{
    public List<InventoryForecastDto> Forecasts { get; set; } = new();
    public InventoryForecastSummaryDto Summary { get; set; } = new();
}

public class InventoryForecastSummaryDto
{
    public int TotalProducts { get; set; }
    public int ProductsNeedingReorder { get; set; }
    public int LowStockProducts { get; set; }
    public int CriticalStockProducts { get; set; }
    public int OutOfStockProducts { get; set; }
    public decimal TotalEstimatedCost { get; set; }
    public int TotalRecommendedQuantity { get; set; }
}
