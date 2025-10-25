using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.Product;

namespace RetailStoreManagement.Controllers;

/// <summary>
/// Controller quản lý thông tin sản phẩm.
/// Tuân thủ chuẩn phản hồi API & xử lý lỗi thống nhất.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(IProductService productService)
    {
        _productService = productService;
    }

    // ========================================================================
    // 1. Lấy danh sách sản phẩm (phân trang)
    // ========================================================================
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IPagedList<ProductResponseModel>>), 200)]
    public async Task<IActionResult> GetPaged([FromQuery] PagedRequest request)
    {
        var result = await _productService.GetPagedAsync(request);
        return Ok(result);
    }

    // ========================================================================
    // 2. Tạo mới sản phẩm
    // ========================================================================
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ProductResponseModel>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    public async Task<IActionResult> Create([FromBody] ProductCreateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<object>.Fail("Dữ liệu không hợp lệ."));

        var entity = new ProductEntity
        {
            ProductName = model.ProductName,
            CategoryId = model.CategoryId,
            SupplierId = model.SupplierId,
            Barcode = model.Barcode,
            Price = model.Price,
            Unit = model.Unit
        };

        var result = await _productService.CreateAsync(entity);
        return Ok(result);
    }

    // ========================================================================
    // 3. Lấy chi tiết sản phẩm
    // ========================================================================
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<ProductResponseModel>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _productService.GetByIdAsync(id);
        if (result.Data == null)
            return NotFound(ApiResponse<object>.Fail("Sản phẩm không tồn tại hoặc đã bị xóa."));

        return Ok(result);
    }

    // ========================================================================
    // 4. Cập nhật thông tin sản phẩm
    // ========================================================================
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<object>.Fail("Dữ liệu cập nhật không hợp lệ."));

        var entity = new ProductEntity
        {
            ProductName = model.ProductName,
            CategoryId = model.CategoryId,
            SupplierId = model.SupplierId,
            Barcode = model.Barcode,
            Price = model.Price,
            Unit = model.Unit
        };

        var result = await _productService.UpdateAsync(id, entity);

        if (result.Data == null)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm để cập nhật."));

        return Ok(result);
    }


    // ========================================================================
    // 5. Xóa mềm sản phẩm
    // ========================================================================
    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteAsync(id);
        if (!result.Data)
            return NotFound(ApiResponse<object>.Fail("Không tìm thấy sản phẩm để xóa."));

        return Ok(result);
    }

    // ========================================================================
    // 6. Tìm kiếm theo tên hoặc mã vạch
    // ========================================================================
    [HttpGet("search")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ProductResponseModel>>), 200)]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        var result = await _productService.SearchAsync(keyword);
        return Ok(result);
    }

    // ========================================================================
    // 7. Lọc theo danh mục và nhà cung cấp
    // ========================================================================
    [HttpGet("filter")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ProductResponseModel>>), 200)]
    public async Task<IActionResult> Filter([FromQuery] int? categoryId, [FromQuery] int? supplierId)
    {
        var result = await _productService.FilterAsync(categoryId, supplierId);
        return Ok(result);
    }
}
