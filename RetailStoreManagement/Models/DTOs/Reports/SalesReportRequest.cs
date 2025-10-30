using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Reports;

public class SalesReportRequest
{
    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [RegularExpression("^(day|week|month)$", ErrorMessage = "GroupBy must be 'day', 'week', or 'month'")]
    public string? GroupBy { get; set; }

    public int? CategoryId { get; set; }
}
