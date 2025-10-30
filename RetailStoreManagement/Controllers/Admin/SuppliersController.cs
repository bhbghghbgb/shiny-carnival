using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Models.DTOs.Suppliers;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class SuppliersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SuppliersController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<SupplierResponseDto>>>> GetSuppliers([FromQuery] PagedRequest request)
    {
        var query = _context.Suppliers.Include(s => s.Products).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(s => s.Name.Contains(request.Search) || s.Email!.Contains(request.Search));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<SupplierResponseDto>>(items);
        var pagedList = new PagedList<SupplierResponseDto>(dtos, totalCount, request.Page, request.PageSize);

        return Ok(ApiResponse<PagedList<SupplierResponseDto>>.Success(pagedList));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SupplierResponseDto>>> GetSupplier(int id)
    {
        var supplier = await _context.Suppliers.Include(s => s.Products).FirstOrDefaultAsync(s => s.Id == id);
        if (supplier == null || supplier.IsDeleted)
            return NotFound(ApiResponse<SupplierResponseDto>.Fail("Supplier not found"));

        var dto = _mapper.Map<SupplierResponseDto>(supplier);
        return Ok(ApiResponse<SupplierResponseDto>.Success(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<SupplierResponseDto>>> CreateSupplier([FromBody] CreateSupplierRequest request)
    {
        var supplier = _mapper.Map<SupplierEntity>(request);
        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<SupplierResponseDto>(supplier);
        return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, ApiResponse<SupplierResponseDto>.Success(dto, "Supplier created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<SupplierResponseDto>>> UpdateSupplier(int id, [FromBody] UpdateSupplierRequest request)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null || supplier.IsDeleted)
            return NotFound(ApiResponse<SupplierResponseDto>.Fail("Supplier not found"));

        supplier.Name = request.Name;
        supplier.Phone = request.Phone;
        supplier.Email = request.Email;
        supplier.Address = request.Address;
        supplier.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<SupplierResponseDto>(supplier);
        return Ok(ApiResponse<SupplierResponseDto>.Success(dto, "Supplier updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSupplier(int id)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null || supplier.IsDeleted)
            return NotFound(ApiResponse<bool>.Fail("Supplier not found"));

        supplier.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Success(true, "Supplier deleted successfully"));
    }
}
