using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Report;

public class InventoryForecastRequest
{
    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }

    [Range(1, 12, ErrorMessage = "LookbackMonths must be between 1 and 12")]
    public int LookbackMonths { get; set; } = 3;

    [Range(1, 90, ErrorMessage = "LeadTimeDays must be between 1 and 90")]
    public int LeadTimeDays { get; set; } = 7;

    [Range(1.0, 3.0, ErrorMessage = "SafetyStockMultiplier must be between 1.0 and 3.0")]
    public decimal SafetyStockMultiplier { get; set; } = 1.5m;
}
