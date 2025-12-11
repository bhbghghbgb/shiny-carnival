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
    public async Task<IActionResult> GetTopProducts([FromQuery] TopProductsSearchRequest request)
    {
        var result = await _reportService.GetTopProductsAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("top-customers")]
    public async Task<IActionResult> GetTopCustomers([FromQuery] TopCustomersSearchRequest request)
    {
        var result = await _reportService.GetTopCustomersAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("promotion")]
    public async Task<IActionResult> GetPromotionReport([FromQuery] PromotionReportRequest request)
    {
        var result = await _reportService.GetPromotionReportAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("inventory-forecast")]
    public async Task<IActionResult> GetInventoryForecast([FromQuery] InventoryForecastRequest request)
    {
        var result = await _reportService.GetInventoryForecastAsync(request);
        return StatusCode(result.StatusCode, result);
    }
}
