using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Models.DTOs.Categories;
using Microsoft.EntityFrameworkCore;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CategoriesController(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<CategoryResponseDto>>>> GetCategories([FromQuery] PagedRequest request)
    {
        var query = _context.Categories.Include(c => c.Products).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(c => c.CategoryName.Contains(request.Search));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<CategoryResponseDto>>(items);
        var pagedList = new PagedList<CategoryResponseDto>(dtos, totalCount, request.Page, request.PageSize);

        return Ok(ApiResponse<PagedList<CategoryResponseDto>>.Success(pagedList));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> GetCategory(int id)
    {
        var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (category == null || category.IsDeleted)
            return NotFound(ApiResponse<CategoryResponseDto>.Fail("Category not found"));

        var dto = _mapper.Map<CategoryResponseDto>(category);
        return Ok(ApiResponse<CategoryResponseDto>.Success(dto));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var category = _mapper.Map<CategoryEntity>(request);
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<CategoryResponseDto>(category);
        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, ApiResponse<CategoryResponseDto>.Success(dto, "Category created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null || category.IsDeleted)
            return NotFound(ApiResponse<CategoryResponseDto>.Fail("Category not found"));

        category.CategoryName = request.CategoryName;
        category.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<CategoryResponseDto>(category);
        return Ok(ApiResponse<CategoryResponseDto>.Success(dto, "Category updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null || category.IsDeleted)
            return NotFound(ApiResponse<bool>.Fail("Category not found"));

        category.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Success(true, "Category deleted successfully"));
    }
}
