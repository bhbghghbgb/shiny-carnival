using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Category;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Controllers.Public;

[ApiController]
[Route("api/public/categories")]
[AllowAnonymous]
public class PublicCategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public PublicCategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<CategoryResponseDto>>>> GetCategories([FromQuery] CategorySearchRequest request)
    {
        var result = await _categoryService.GetCategoriesAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<CategoryResponseDto>>> GetCategoryById(int id)
    {
        var result = await _categoryService.GetCategoryByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}

