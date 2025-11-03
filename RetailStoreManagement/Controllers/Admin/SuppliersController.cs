using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Supplier;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/suppliers")]
[Authorize(Roles = "Admin")]
public class SuppliersController : ControllerBase
{
    private readonly ISupplierService _supplierService;

    public SuppliersController(ISupplierService supplierService)
    {
        _supplierService = supplierService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSuppliers([FromQuery] PagedRequest request)
    {
        var result = await _supplierService.GetSuppliersAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSupplier(int id)
    {
        var result = await _supplierService.GetSupplierByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSupplier([FromBody] CreateSupplierRequest request)
    {
        var result = await _supplierService.CreateSupplierAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSupplier(int id, [FromBody] UpdateSupplierRequest request)
    {
        var result = await _supplierService.UpdateSupplierAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSupplier(int id)
    {
        var result = await _supplierService.DeleteSupplierAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
