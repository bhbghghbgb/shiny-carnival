using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Category;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Interfaces.Services;

public interface ICategoryService
{
    Task<ApiResponse<PagedList<CategoryResponseDto>>> GetCategoriesAsync(CategorySearchRequest request);
    Task<ApiResponse<CategoryResponseDto>> GetCategoryByIdAsync(int id);
    Task<ApiResponse<CategoryResponseDto>> CreateCategoryAsync(CreateCategoryRequest request);
    Task<ApiResponse<CategoryResponseDto>> UpdateCategoryAsync(int id, UpdateCategoryRequest request);
    Task<ApiResponse<bool>> DeleteCategoryAsync(int id);
}
