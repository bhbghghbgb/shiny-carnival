using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Category;

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

    public async Task<ApiResponse<PagedList<CategoryResponseDto>>> GetCategoriesAsync(PagedRequest request)
    {
        try
        {
            var query = _unitOfWork.Categories.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(c => c.CategoryName.Contains(request.Search));
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(c => EF.Property<object>(c, request.SortBy))
                : query.OrderBy(c => EF.Property<object>(c, request.SortBy));

            var totalCount = await query.CountAsync();
            var items = await query
                .Include(c => c.Products)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var categoryDtos = _mapper.Map<List<CategoryResponseDto>>(items);
            var pagedList = new PagedList<CategoryResponseDto>(categoryDtos, totalCount, request.Page, request.PageSize);

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
