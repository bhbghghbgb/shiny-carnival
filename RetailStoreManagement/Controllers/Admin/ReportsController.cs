using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Reports;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<ApiResponse<RevenueReportDto>>> GetRevenueReport([FromQuery] RevenueReportRequest request)
    {
        var result = await _reportService.GetRevenueReportAsync(request);
        return Ok(result);
    }

    [HttpGet("sales")]
    public async Task<ActionResult<ApiResponse<SalesReportDto>>> GetSalesReport([FromQuery] SalesReportRequest request)
    {
        var result = await _reportService.GetSalesReportAsync(request);
        return Ok(result);
    }

    [HttpGet("top-products")]
    public async Task<ActionResult<ApiResponse<List<TopProductDto>>>> GetTopProducts(
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate, 
        [FromQuery] int limit = 10)
    {
        var result = await _reportService.GetTopProductsAsync(startDate, endDate, limit);
        return Ok(result);
    }

    [HttpGet("top-customers")]
    public async Task<ActionResult<ApiResponse<List<TopCustomerDto>>>> GetTopCustomers(
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate, 
        [FromQuery] int limit = 10)
    {
        var result = await _reportService.GetTopCustomersAsync(startDate, endDate, limit);
        return Ok(result);
    }
}
