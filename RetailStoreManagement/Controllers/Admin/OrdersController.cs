using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Orders;
using RetailStoreManagement.Models.DTOs.OrderItems;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOrStaff")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<OrderListDto>>>> GetOrders([FromQuery] OrderSearchRequest request)
    {
        var result = await _orderService.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> GetOrder(int id)
    {
        var result = await _orderService.GetByIdAsync(id);
        return result.IsError ? NotFound(result) : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userId = GetCurrentUserId();
        var result = await _orderService.CreateAsync(request, userId);
        return result.IsError ? BadRequest(result) : CreatedAtAction(nameof(GetOrder), new { id = result.Data!.Id }, result);
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var userId = GetCurrentUserId();
        var result = await _orderService.UpdateStatusAsync(id, request, userId);
        return result.IsError ? BadRequest(result) : Ok(result);
    }

    [HttpGet("{id}/invoice")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        try
        {
            var pdfBytes = await _orderService.GenerateInvoicePdfAsync(id);
            return File(pdfBytes, "application/pdf", $"invoice-{id}.pdf");
        }
        catch (Exception ex)
        {
            return NotFound(ApiResponse<object>.Fail(ex.Message));
        }
    }
}
