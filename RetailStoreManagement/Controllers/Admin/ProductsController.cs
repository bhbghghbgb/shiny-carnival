using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Products;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<ProductListDto>>>> GetProducts([FromQuery] ProductSearchRequest request)
    {
        var result = await _productService.GetPagedAsync(request);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> GetProduct(int id)
    {
        var result = await _productService.GetByIdAsync(id);
        return result.IsError ? NotFound(result) : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> CreateProduct([FromBody] CreateProductRequest request)
    {
        var result = await _productService.CreateAsync(request);
        return result.IsError ? BadRequest(result) : CreatedAtAction(nameof(GetProduct), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        request.Id = id;
        var result = await _productService.UpdateAsync(id, request);
        return result.IsError ? BadRequest(result) : Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteProduct(int id)
    {
        var result = await _productService.DeleteAsync(id);
        return result.IsError ? NotFound(result) : Ok(result);
    }
}
