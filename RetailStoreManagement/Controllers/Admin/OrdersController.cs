using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Models.Order;
using System.Security.Claims;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/orders")]
[Authorize] // Require authentication, specific roles checked at method level
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can get orders list
    public async Task<IActionResult> GetOrders([FromQuery] OrderSearchRequest request)
    {
        var result = await _orderService.GetOrdersAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can get order details
    public async Task<IActionResult> GetOrder(int id)
    {
        var result = await _orderService.GetOrderByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can create orders
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _orderService.CreateOrderAsync(request, userId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can update order status
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = await _orderService.UpdateOrderStatusAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("{orderId}/items")]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can add order items
    public async Task<IActionResult> AddOrderItem(int orderId, [FromBody] AddOrderItemRequest request)
    {
        var result = await _orderService.AddOrderItemAsync(orderId, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{orderId}/items/{itemId}")]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can update order items
    public async Task<IActionResult> UpdateOrderItem(int orderId, int itemId, [FromBody] UpdateOrderItemRequest request)
    {
        var result = await _orderService.UpdateOrderItemAsync(orderId, itemId, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{orderId}/items/{itemId}")]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can delete order items
    public async Task<IActionResult> DeleteOrderItem(int orderId, int itemId)
    {
        var result = await _orderService.DeleteOrderItemAsync(orderId, itemId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can delete orders
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var result = await _orderService.DeleteOrderAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("total-revenue")]
    [Authorize(Roles = "Admin")] // Only Admin can view revenue reports
    public async Task<IActionResult> GetTotalRevenue([FromQuery] OrderRevenueRequest? request)
    {
        var result = await _orderService.GetTotalRevenueAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}/invoice")]
    [Authorize(Roles = "Admin")] // Only Admin can generate invoices
    public async Task<IActionResult> GetInvoice(int id)
    {
        try
        {
            var pdfBytes = await _orderService.GenerateInvoicePdfAsync(id);
            return File(pdfBytes, "application/pdf", $"invoice_{id}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(400, ApiResponse<object>.Error(ex.Message, 400));
        }
    }
}
