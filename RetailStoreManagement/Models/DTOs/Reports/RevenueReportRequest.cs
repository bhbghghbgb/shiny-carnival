using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Reports;

public class RevenueReportRequest
{
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    [RegularExpression("^(day|week|month)$", ErrorMessage = "GroupBy must be 'day', 'week', or 'month'")]
    public string GroupBy { get; set; } = "day";
}
