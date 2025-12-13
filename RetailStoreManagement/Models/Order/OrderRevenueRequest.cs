namespace RetailStoreManagement.Models.Order;

/// <summary>
/// Request model cho tính tổng doanh thu
/// Chỉ chứa các filter params, không có pagination/sorting
/// </summary>
public class OrderRevenueRequest
{
    public string? Status { get; set; }
    public int? CustomerId { get; set; }
    public int? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Search { get; set; }
}

