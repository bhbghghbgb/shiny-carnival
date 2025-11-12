using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Report;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/reports")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenueReport([FromQuery] RevenueReportRequest request)
    {
        var result = await _reportService.GetRevenueReportAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("sales")]
    public async Task<IActionResult> GetSalesReport([FromQuery] SalesReportRequest request)
    {
        var result = await _reportService.GetSalesReportAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int limit = 10)
    {
        var result = await _reportService.GetTopProductsAsync(startDate, endDate, limit);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("top-customers")]
    public async Task<IActionResult> GetTopCustomers([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int limit = 10)
    {
        var result = await _reportService.GetTopCustomersAsync(startDate, endDate, limit);
        return StatusCode(result.StatusCode, result);
    }
}
