using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Models.Product;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/products")]
[Authorize(Roles = "Admin")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductSearchRequest request)
    {
        var result = await _productService.GetProductsAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(int id)
    {
        var result = await _productService.GetProductByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("by-ids")]
    public async Task<IActionResult> GetProductsByIds([FromBody] List<int> ids)
    {
        var result = await _productService.GetProductsByIdsAsync(ids);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var result = await _productService.CreateProductAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductRequest request)
    {
        var result = await _productService.UpdateProductAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await _productService.DeleteProductAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
