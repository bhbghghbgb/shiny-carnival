using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Models.Order;

namespace RetailStoreManagement.Controllers.Public;

[ApiController]
[Route("api/public/orders")]
[AllowAnonymous]
public class PublicOrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    // UserId mặc định cho đơn công khai
    private const int DefaultUserId = 2;

    public PublicOrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [Consumes("application/json", "text/json", "application/*+json")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var result = await _orderService.CreateOrderAsync(request, DefaultUserId);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderDetailsDto>>> GetOrderById(int id)
    {
        var result = await _orderService.GetOrderByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}

