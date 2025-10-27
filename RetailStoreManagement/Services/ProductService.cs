using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.Product;

namespace RetailStoreManagement.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;

    public ProductService(IProductRepository repository)
    {
        _repository = repository;
    }

    // ================================
    // Lấy danh sách có phân trang
    // ================================
    public async Task<ApiResponse<IPagedList<ProductResponseModel>>> GetPagedAsync(PagedRequest request)
    {
        var paged = await _repository.GetPagedAsync(request);

        var responseItems = paged.Items.Select(MapToResponseModel).ToList();
        var result = new PagedList<ProductResponseModel>(responseItems, paged.TotalCount, paged.Page, paged.PageSize);

        return ApiResponse<IPagedList<ProductResponseModel>>.Success(result);
    }

    // ================================
    // Lấy chi tiết theo ID
    // ================================
    public async Task<ApiResponse<ProductResponseModel>> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null)
            return ApiResponse<ProductResponseModel>.Fail("Không tìm thấy sản phẩm.");

        return ApiResponse<ProductResponseModel>.Success(MapToResponseModel(entity));
    }

    // ================================
    // Tạo mới
    // ================================
    public async Task<ApiResponse<ProductResponseModel>> CreateAsync(ProductEntity entity)
    {
        var created = await _repository.AddAsync(entity);
        return ApiResponse<ProductResponseModel>.Success(MapToResponseModel(created), "Thêm sản phẩm thành công.");
    }

    // ================================
    // Cập nhật
    // ================================
    public async Task<ApiResponse<ProductResponseModel>> UpdateAsync(int id, ProductEntity updatedEntity)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return ApiResponse<ProductResponseModel>.Fail("Không tìm thấy sản phẩm để cập nhật.");

        // Cập nhật dữ liệu
        existing.ProductName = updatedEntity.ProductName;
        existing.CategoryId = updatedEntity.CategoryId;
        existing.SupplierId = updatedEntity.SupplierId;
        existing.Barcode = updatedEntity.Barcode;
        existing.Price = updatedEntity.Price;
        existing.Unit = updatedEntity.Unit; 

        await _repository.UpdateAsync(existing);
        return ApiResponse<ProductResponseModel>.Success(MapToResponseModel(existing), "Cập nhật thành công.");
    }

    // ================================
    // Xóa mềm
    // ================================
    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return ApiResponse<bool>.Fail("Không tìm thấy sản phẩm để xóa.");

        await _repository.SoftDeleteAsync(id);
        return ApiResponse<bool>.Success(true, "Đã xóa sản phẩm.");
    }

    // ================================
    // Tìm kiếm
    // ================================
    public async Task<ApiResponse<IEnumerable<ProductResponseModel>>> SearchAsync(string keyword)
    {
        var products = await _repository.SearchAsync(keyword);
        var result = products.Select(MapToResponseModel);
        return ApiResponse<IEnumerable<ProductResponseModel>>.Success(result);
    }

    // ================================
    // Lọc theo category / supplier
    // ================================
    public async Task<ApiResponse<IEnumerable<ProductResponseModel>>> FilterAsync(int? categoryId, int? supplierId)
    {
        var products = await _repository.FilterAsync(categoryId, supplierId);
        var result = products.Select(MapToResponseModel);
        return ApiResponse<IEnumerable<ProductResponseModel>>.Success(result);
    }

    // ================================
    // MAP ENTITY → RESPONSE MODEL
    // ================================
    private static ProductResponseModel MapToResponseModel(ProductEntity entity)
    {
        return new ProductResponseModel
        {
            Id = entity.Id,
            ProductName = entity.ProductName,
            Barcode = entity.Barcode,
            Price = entity.Price,
            Unit = entity.Unit,
            CategoryName = entity.Category?.CategoryName ?? string.Empty,
            SupplierName = entity.Supplier?.Name ?? string.Empty,
            Quantity = entity.Inventory?.Quantity ?? 0
        };
    }
}
