using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Inventory;
using System.Security.Claims;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/inventory")]
[Authorize] // Both Admin and Staff can access
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetInventory([FromQuery] InventorySearchRequest request)
    {
        var result = await _inventoryService.GetInventoryAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetInventoryByProductId(int productId)
    {
        var result = await _inventoryService.GetInventoryByProductIdAsync(productId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPatch("{productId}")]
    public async Task<IActionResult> UpdateInventory(int productId, [FromBody] UpdateInventoryRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _inventoryService.UpdateInventoryAsync(productId, request, userId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStockAlerts()
    {
        var result = await _inventoryService.GetLowStockAlertsAsync();
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{productId}/history")]
    public async Task<IActionResult> GetInventoryHistory(int productId, [FromQuery] PagedRequest request)
    {
        var result = await _inventoryService.GetInventoryHistoryAsync(productId, request);
        return StatusCode(result.StatusCode, result);
    }
}
