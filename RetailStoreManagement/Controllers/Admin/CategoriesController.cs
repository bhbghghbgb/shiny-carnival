using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Category;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/categories")]
[Authorize] // Require authentication, specific roles checked at method level
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can get categories list
    public async Task<IActionResult> GetCategories([FromQuery] CategorySearchRequest request)
    {
        var result = await _categoryService.GetCategoriesAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Staff")] // Both Admin and Staff can get category details
    public async Task<IActionResult> GetCategory(int id)
    {
        var result = await _categoryService.GetCategoryByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")] // Only Admin can create categories
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var result = await _categoryService.CreateCategoryAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can update categories
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
    {
        var result = await _categoryService.UpdateCategoryAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")] // Only Admin can delete categories
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var result = await _categoryService.DeleteCategoryAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
