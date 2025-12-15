using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Models.Product;

namespace RetailStoreManagement.Controllers.Public;

[ApiController]
[Route("api/public/products")]
[AllowAnonymous]
public class PublicProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public PublicProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<ProductListDto>>>> GetProducts([FromQuery] ProductSearchRequest request)
    {
        var result = await _productService.GetProductsAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> GetProductById(int id)
    {
        var result = await _productService.GetProductByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("by-ids")]
    public async Task<ActionResult<ApiResponse<List<ProductResponseDto>>>> GetProductsByIds([FromBody] List<int> ids)
    {
        var result = await _productService.GetProductsByIdsAsync(ids);
        return StatusCode(result.StatusCode, result);
    }
}



