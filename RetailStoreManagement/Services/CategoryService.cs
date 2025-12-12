using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Category;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<CategoryResponseDto>>> GetCategoriesAsync(CategorySearchRequest request)
    {
        try
        {
            // Xây dựng query ban đầu với AsNoTracking để tối ưu hiệu năng
            var query = _unitOfWork.Categories.GetQueryable()
                .AsNoTracking()
                .Include(c => c.Products)
                .AsQueryable();

            // Áp dụng bộ lọc tìm kiếm theo tên
            if (!string.IsNullOrEmpty(request.Search))
            {
                var searchTerm = request.Search.Trim();
                query = query.Where(c => c.CategoryName.Contains(searchTerm));
            }

            // Áp dụng bộ lọc theo số lượng sản phẩm tối thiểu
            if (request.MinProductCount.HasValue)
            {
                query = query.Where(c => c.Products.Count >= request.MinProductCount.Value);
            }

            // Áp dụng bộ lọc theo số lượng sản phẩm tối đa
            if (request.MaxProductCount.HasValue)
            {
                query = query.Where(c => c.Products.Count <= request.MaxProductCount.Value);
            }

            // Áp dụng bộ lọc theo ngày tạo từ
            if (request.CreatedAfter.HasValue)
            {
                query = query.Where(c => c.CreatedAt >= request.CreatedAfter.Value);
            }

            // Áp dụng bộ lọc theo ngày tạo đến
            if (request.CreatedBefore.HasValue)
            {
                query = query.Where(c => c.CreatedAt <= request.CreatedBefore.Value);
            }

            // Áp dụng sắp xếp
            query = request.SortDesc
                ? query.OrderByDescending(c => EF.Property<object>(c, request.SortBy))
                : query.OrderBy(c => EF.Property<object>(c, request.SortBy));

            // Ánh xạ sang DTO và giữ IQueryable
            var categoryDtoQuery = query.Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                CategoryName = c.CategoryName,
                ProductCount = c.Products.Count()
            });

            // Sử dụng PagedList.CreateAsync để phân trang tại database
            var pagedList = await PagedList<CategoryResponseDto>.CreateAsync(
                categoryDtoQuery,
                request.Page,
                request.PageSize
            );

            return ApiResponse<PagedList<CategoryResponseDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<CategoryResponseDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<CategoryResponseDto>> GetCategoryByIdAsync(int id)
    {
        try
        {
            var category = await _unitOfWork.Categories.GetQueryable()
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return ApiResponse<CategoryResponseDto>.Error("Category not found", 404);
            }

            var categoryDto = _mapper.Map<CategoryResponseDto>(category);
            return ApiResponse<CategoryResponseDto>.Success(categoryDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<CategoryResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<CategoryResponseDto>> CreateCategoryAsync(CreateCategoryRequest request)
    {
        try
        {
            // Check if category name already exists
            var existingCategory = await _unitOfWork.Categories.GetQueryable()
                .FirstOrDefaultAsync(c => c.CategoryName == request.CategoryName);
            
            if (existingCategory != null)
            {
                return ApiResponse<CategoryResponseDto>.Error("Category name already exists", 409);
            }

            var category = _mapper.Map<CategoryEntity>(request);

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();

            var categoryDto = _mapper.Map<CategoryResponseDto>(category);
            return ApiResponse<CategoryResponseDto>.Success(categoryDto, "Category created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<CategoryResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<CategoryResponseDto>> UpdateCategoryAsync(int id, UpdateCategoryRequest request)
    {
        try
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return ApiResponse<CategoryResponseDto>.Error("Category not found", 404);
            }

            // Check if category name already exists (excluding current category)
            var existingCategory = await _unitOfWork.Categories.GetQueryable()
                .FirstOrDefaultAsync(c => c.CategoryName == request.CategoryName && c.Id != id);
            
            if (existingCategory != null)
            {
                return ApiResponse<CategoryResponseDto>.Error("Category name already exists", 409);
            }

            _mapper.Map(request, category);

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();

            var categoryDto = _mapper.Map<CategoryResponseDto>(category);
            return ApiResponse<CategoryResponseDto>.Success(categoryDto, "Category updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<CategoryResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<bool>> DeleteCategoryAsync(int id)
    {
        try
        {
            var category = await _unitOfWork.Categories.GetQueryable()
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return ApiResponse<bool>.Error("Category not found", 404);
            }

            // Check if category has products
            if (category.Products.Any())
            {
                return ApiResponse<bool>.Error("Cannot delete category that has products", 409);
            }

            await _unitOfWork.Categories.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Category deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(ex.Message);
        }
    }
}
