using RetailStoreManagement.Common;

namespace RetailStoreManagement.Models.DTOs.Orders;

public class OrderSearchRequest : PagedRequest
{
    public string? Status { get; set; }
    public int? CustomerId { get; set; }
    public int? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}
