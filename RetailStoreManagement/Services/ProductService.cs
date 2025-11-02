using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Product;

namespace RetailStoreManagement.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<ProductListDto>>> GetProductsAsync(ProductSearchRequest request)
    {
        try
        {
            var query = _unitOfWork.Products.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(p => p.ProductName.Contains(request.Search) ||
                                        p.Barcode!.Contains(request.Search));
            }

            // Apply category filter
            if (request.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == request.CategoryId.Value);
            }

            // Apply supplier filter
            if (request.SupplierId.HasValue)
            {
                query = query.Where(p => p.SupplierId == request.SupplierId.Value);
            }

            // Apply price filter
            if (request.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= request.MinPrice.Value);
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= request.MaxPrice.Value);
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(p => EF.Property<object>(p, request.SortBy))
                : query.OrderBy(p => EF.Property<object>(p, request.SortBy));

            var totalCount = await query.CountAsync();
            var items = await query
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .Include(p => p.Inventory)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var productDtos = _mapper.Map<List<ProductListDto>>(items);
            var pagedList = new PagedList<ProductListDto>(productDtos, request.Page, request.PageSize, totalCount);

            return ApiResponse<PagedList<ProductListDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<ProductListDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<ProductResponseDto>> GetProductByIdAsync(int id)
    {
        try
        {
            var product = await _unitOfWork.Products.GetQueryable()
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .Include(p => p.Inventory)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return ApiResponse<ProductResponseDto>.Error("Product not found", 404);
            }

            var productDto = _mapper.Map<ProductResponseDto>(product);
            return ApiResponse<ProductResponseDto>.Success(productDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<ProductResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<ProductResponseDto>> CreateProductAsync(CreateProductRequest request)
    {
        try
        {
            // Check if barcode already exists
            var existingProduct = await _unitOfWork.Products.GetQueryable()
                .FirstOrDefaultAsync(p => p.Barcode == request.Barcode);

            if (existingProduct != null)
            {
                return ApiResponse<ProductResponseDto>.Error("Barcode already exists", 409);
            }

            var product = _mapper.Map<ProductEntity>(request);

            await _unitOfWork.Products.AddAsync(product);
            await _unitOfWork.SaveChangesAsync();

            // Create inventory for the new product
            var inventory = new InventoryEntity { ProductId = product.Id, Quantity = 0 };
            await _unitOfWork.Inventory.AddAsync(inventory);
            await _unitOfWork.SaveChangesAsync();

            var productDto = _mapper.Map<ProductResponseDto>(product);
            return ApiResponse<ProductResponseDto>.Success(productDto, "Product created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<ProductResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<ProductResponseDto>> UpdateProductAsync(int id, UpdateProductRequest request)
    {
        try
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return ApiResponse<ProductResponseDto>.Error("Product not found", 404);
            }

            // Check if barcode already exists (excluding current product)
            var existingProduct = await _unitOfWork.Products.GetQueryable()
                .FirstOrDefaultAsync(p => p.Barcode == request.Barcode && p.Id != id);

            if (existingProduct != null)
            {
                return ApiResponse<ProductResponseDto>.Error("Barcode already exists", 409);
            }

            _mapper.Map(request, product);

            await _unitOfWork.Products.UpdateAsync(product);
            await _unitOfWork.SaveChangesAsync();

            var productDto = _mapper.Map<ProductResponseDto>(product);
            return ApiResponse<ProductResponseDto>.Success(productDto, "Product updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<ProductResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
    {
        try
        {
            var product = await _unitOfWork.Products.GetByIdAsync(id);
            if (product == null)
            {
                return ApiResponse<bool>.Error("Product not found", 404);
            }

            await _unitOfWork.Products.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Product deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(ex.Message);
        }
    }
}
