using System.ComponentModel.DataAnnotations;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Models.Report;

/// <summary>
/// Request model cho báo cáo Top Products
/// Kế thừa từ BasePagedRequest (chỉ có Page, PageSize)
/// KHÔNG có Search, SortBy, SortDesc vì endpoint sử dụng fixed sorting theo TotalRevenue
/// </summary>
public class TopProductsSearchRequest : BasePagedRequest
{
    /// <summary>
    /// Ngày bắt đầu của khoảng thời gian báo cáo
    /// </summary>
    [Required]
    public DateTime StartDate { get; set; }

    /// <summary>
    /// Ngày kết thúc của khoảng thời gian báo cáo
    /// </summary>
    [Required]
    public DateTime EndDate { get; set; }
}

