using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ReportConstants;

namespace RetailStoreManagement.Models.Report;

public class InventoryForecastRequest
{
    public int? ProductId { get; set; }
    public int? CategoryId { get; set; }

    [Range(MIN_LOOKBACK_MONTHS, MAX_LOOKBACK_MONTHS, ErrorMessage = "LookbackMonths must be between 1 and 12")]
    public int LookbackMonths { get; set; } = 3;

    [Range(MIN_LEAD_TIME_DAYS, MAX_LEAD_TIME_DAYS, ErrorMessage = "LeadTimeDays must be between 1 and 90")]
    public int LeadTimeDays { get; set; } = 7;

    [Range(1.0, 3.0, ErrorMessage = "SafetyStockMultiplier must be between 1.0 and 3.0")]
    public decimal SafetyStockMultiplier { get; set; } = 1.5m;
}
