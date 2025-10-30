using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Inventory;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOrStaff")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public InventoryController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<InventoryResponseDto>>>> GetInventory([FromQuery] PagedRequest request)
    {
        var result = await _inventoryService.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpGet("{productId}")]
    public async Task<ActionResult<ApiResponse<InventoryResponseDto>>> GetInventoryByProduct(int productId)
    {
        var result = await _inventoryService.GetByProductIdAsync(productId);
        return result.IsError ? NotFound(result) : Ok(result);
    }

    [HttpPatch("{productId}")]
    public async Task<ActionResult<ApiResponse<InventoryResponseDto>>> UpdateInventory(int productId, [FromBody] UpdateInventoryRequest request)
    {
        var userId = GetCurrentUserId();
        var result = await _inventoryService.UpdateAsync(productId, request, userId);
        return result.IsError ? BadRequest(result) : Ok(result);
    }

    [HttpGet("low-stock")]
    public async Task<ActionResult<ApiResponse<List<LowStockAlertDto>>>> GetLowStockAlerts([FromQuery] int threshold = 10)
    {
        var result = await _inventoryService.GetLowStockAlertsAsync(threshold);
        return Ok(result);
    }

    [HttpGet("{productId}/history")]
    public async Task<ActionResult<ApiResponse<PagedList<InventoryHistoryDto>>>> GetInventoryHistory(int productId, [FromQuery] PagedRequest request)
    {
        var result = await _inventoryService.GetHistoryAsync(productId, request);
        return Ok(result);
    }
}
