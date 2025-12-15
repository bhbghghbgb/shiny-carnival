using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Customer;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "Admin")] // Only Admin can access
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] CustomerSearchRequest request)
    {
        var result = await _customerService.GetCustomersAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomer(int id)
    {
        var result = await _customerService.GetCustomerByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        var result = await _customerService.CreateCustomerAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UpdateCustomerRequest request)
    {
        var result = await _customerService.UpdateCustomerAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var result = await _customerService.DeleteCustomerAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
