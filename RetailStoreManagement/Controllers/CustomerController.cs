using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.CustomerModel;
using RetailStoreManagement.Common;

namespace RetailStoreManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class CustomerController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomerController(ICustomerService service)
    {
        _service = service;
    }

    private CustomerResponse ToResponse(CustomerEntity entity)
    {
        return new CustomerResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            Phone = entity.Phone,
            Email = entity.Email,
            Address = entity.Address
        };
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<CustomerResponse>.Fail(result.Message ?? "Customer not found"));
        }
        return Ok(ApiResponse<CustomerResponse>.Success(ToResponse(result.Data)));
    }

    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] PagedRequest request)
    {
        var result = await _service.GetPagedAsync(request);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<IPagedList<CustomerResponse>>.Fail(result.Message ?? "No customers found"));
        }
        var paged = new PagedList<CustomerResponse>(
            result.Data.Items.Select(ToResponse),
            result.Data.TotalCount,
            result.Data.Page,
            result.Data.PageSize
        );
        return Ok(ApiResponse<IPagedList<CustomerResponse>>.Success(paged));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CustomerRequest req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<CustomerResponse>.Fail("Invalid request"));
        }
        
        var entity = new CustomerEntity
        {
            Name = req.Name,
            Phone = req.Phone,
            Email = req.Email,
            Address = req.Address
        };
        var result = await _service.CreateAsync(entity);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<CustomerResponse>.Fail(result.Message ?? "Create failed"));
        }
        
        return Ok(ApiResponse<CustomerResponse>.Success(ToResponse(result.Data)));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CustomerRequest req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<CustomerResponse>.Fail("Invalid request"));
        }
        
        var existingResult = await _service.GetByIdAsync(id);
        if (existingResult.IsError || existingResult.Data == null)
        {
            return BadRequest(ApiResponse<CustomerResponse>.Fail(existingResult.Message ?? "Customer not found"));
        }
        var entity = existingResult.Data;
            entity.Name = req.Name;
            entity.Phone = req.Phone;
            entity.Email = req.Email;
            entity.Address = req.Address;
        var result = await _service.UpdateAsync(id, entity);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<CustomerResponse>.Fail(result.Message ?? "Update failed"));
        }
        return Ok(ApiResponse<CustomerResponse>.Success(ToResponse(result.Data)));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (result.IsError)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }

    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> GetByName(string name)
    {
        var result = await _service.GetByNameAsync(name);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<CustomerResponse>.Fail(result.Message ?? "Customer not found"));
        }
        return Ok(ApiResponse<CustomerResponse>.Success(ToResponse(result.Data)));
    }
}