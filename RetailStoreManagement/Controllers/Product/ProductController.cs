using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models;

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
    // 1. Lấy danh sách sản phẩm (phân trang, tìm kiếm, sắp xếp)
    // ========================================================================
    /// <summary>
    /// Lấy danh sách sản phẩm với hỗ trợ phân trang, tìm kiếm và sắp xếp.
    /// </summary>
    /// <param name="request">Thông tin phân trang (Page, PageSize, SortBy, SortDesc, Search)</param>
    /// <returns>Danh sách sản phẩm dạng phân trang</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IPagedList<ProductEntity>>), 200)]
    public async Task<IActionResult> GetPaged([FromQuery] PagedRequest request)
    {
        var result = await _productService.GetPagedAsync(request);
        return Ok(result); // 200 OK – ApiResponse.Success()
    }

    // ========================================================================
    // 2. Tạo mới sản phẩm
    // ========================================================================
    /// <summary>
    /// Thêm mới sản phẩm (chỉ Admin được phép thao tác).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ProductEntity>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 403)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductCreateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<string>.Fail("Invalid input data."));

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
    // 3. Lấy chi tiết sản phẩm theo ID
    // ========================================================================
    /// <summary>
    /// Lấy chi tiết một sản phẩm theo ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<ProductEntity>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _productService.GetByIdAsync(id);

        if (!result.IsSuccess)
        {
            // 404 Not Found
            var errorResponse = ApiResponse<object>.Fail("Sản phẩm không tồn tại hoặc đã bị xóa.");
            return new ObjectResult(errorResponse) { StatusCode = 404 };
        }

        return Ok(result);
    }

// ========================================================================
    // 4. Cập nhật thông tin sản phẩm
    // ========================================================================
    /// <summary>
    /// Cập nhật thông tin sản phẩm (chỉ Admin được phép thao tác).
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<ProductEntity>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 400)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> Update(int id, [FromBody] ProductEntity product)
    {
        if (!ModelState.IsValid)
        {
            var invalidResponse = ApiResponse<object>.Fail("Dữ liệu cập nhật không hợp lệ.");
            return new ObjectResult(invalidResponse) { StatusCode = 400 };
        }

        var result = await _productService.UpdateAsync(id, product);
        if (!result.IsSuccess)
        {
            var notFoundResponse = ApiResponse<object>.Fail("Không tìm thấy sản phẩm để cập nhật.");
            return new ObjectResult(notFoundResponse) { StatusCode = 404 };
        }

        return Ok(result); // 200 OK
    }

    // ========================================================================
    // 5. Xóa mềm sản phẩm
    // ========================================================================
    /// <summary>
    /// Xóa mềm sản phẩm (chỉ Admin được phép thao tác).
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 404)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteAsync(id);

        if (!result.IsSuccess)
        {
            var notFoundResponse = ApiResponse<object>.Fail("Không tìm thấy sản phẩm để xóa.");
            return new ObjectResult(notFoundResponse) { StatusCode = 404 };
        }

        return Ok(result); // 200 OK
    }

    // ========================================================================
    // 6. Tìm kiếm sản phẩm theo tên hoặc mã vạch
    // ========================================================================
    /// <summary>
    /// Tìm kiếm sản phẩm theo tên hoặc mã vạch.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ProductEntity>>), 200)]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        var result = await _productService.SearchAsync(keyword);
        return Ok(result); // 200 OK
    }

    // ========================================================================
    // 7. Lọc sản phẩm theo danh mục và nhà cung cấp
    // ========================================================================
    /// <summary>
    /// Lọc sản phẩm theo danh mục và/hoặc nhà cung cấp.
    /// </summary>
    [HttpGet("filter")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ProductEntity>>), 200)]
    public async Task<IActionResult> Filter([FromQuery] int? categoryId, [FromQuery] int? supplierId)
    {
        var result = await _productService.FilterAsync(categoryId, supplierId);
        return Ok(result); // 200 OK
    }



    
}
