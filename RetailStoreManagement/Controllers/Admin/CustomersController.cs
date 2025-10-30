using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Models.DTOs.Customers;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOrStaff")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CustomersController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<CustomerListDto>>>> GetCustomers([FromQuery] PagedRequest request)
    {
        var query = _context.Customers.Include(c => c.Orders).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(c => c.Name.Contains(request.Search) || 
                                    c.Phone!.Contains(request.Search) || 
                                    c.Email!.Contains(request.Search));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<CustomerListDto>>(items);
        var pagedList = new PagedList<CustomerListDto>(dtos, totalCount, request.Page, request.PageSize);

        return Ok(ApiResponse<PagedList<CustomerListDto>>.Success(pagedList));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CustomerResponseDto>>> GetCustomer(int id)
    {
        var customer = await _context.Customers.Include(c => c.Orders).FirstOrDefaultAsync(c => c.Id == id);
        if (customer == null || customer.IsDeleted)
            return NotFound(ApiResponse<CustomerResponseDto>.Fail("Customer not found"));

        var dto = _mapper.Map<CustomerResponseDto>(customer);
        return Ok(ApiResponse<CustomerResponseDto>.Success(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CustomerResponseDto>>> CreateCustomer([FromBody] CreateCustomerRequest request)
    {
        var customer = _mapper.Map<CustomerEntity>(request);
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<CustomerResponseDto>(customer);
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, ApiResponse<CustomerResponseDto>.Success(dto, "Customer created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CustomerResponseDto>>> UpdateCustomer(int id, [FromBody] UpdateCustomerRequest request)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null || customer.IsDeleted)
            return NotFound(ApiResponse<CustomerResponseDto>.Fail("Customer not found"));

        customer.Name = request.Name;
        customer.Phone = request.Phone;
        customer.Email = request.Email;
        customer.Address = request.Address;
        customer.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<CustomerResponseDto>(customer);
        return Ok(ApiResponse<CustomerResponseDto>.Success(dto, "Customer updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null || customer.IsDeleted)
            return NotFound(ApiResponse<bool>.Fail("Customer not found"));

        customer.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Success(true, "Customer deleted successfully"));
    }
}
