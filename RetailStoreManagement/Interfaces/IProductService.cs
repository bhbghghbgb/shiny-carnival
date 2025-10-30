using RetailStoreManagement.Common;
using RetailStoreManagement.Models.DTOs.Products;

namespace RetailStoreManagement.Interfaces;

public interface IProductService
{
    Task<ApiResponse<ProductResponseDto>> GetByIdAsync(int id);
    Task<ApiResponse<PagedList<ProductListDto>>> GetPagedAsync(ProductSearchRequest request);
    Task<ApiResponse<ProductResponseDto>> CreateAsync(CreateProductRequest request);
    Task<ApiResponse<ProductResponseDto>> UpdateAsync(int id, UpdateProductRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id);
    Task<bool> BarcodeExistsAsync(string barcode, int? excludeId = null);
}
