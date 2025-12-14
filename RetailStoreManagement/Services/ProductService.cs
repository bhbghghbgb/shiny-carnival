using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Npgsql;
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

            // Include related entities and project to DTO
            var dtoQuery = query
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .Include(p => p.Inventory)
                .Select(p => new ProductListDto
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Barcode = p.Barcode ?? string.Empty,
                    Price = p.Price,
                    Unit = p.Unit ?? string.Empty,
                    CategoryName = p.Category != null ? p.Category.CategoryName : string.Empty,
                    SupplierName = p.Supplier != null ? p.Supplier.Name : string.Empty,
                    InventoryQuantity = p.Inventory != null ? p.Inventory.Quantity : 0
                });

            // Use the new CreateAsync method for pagination
            var pagedList = await PagedList<ProductListDto>.CreateAsync(dtoQuery, request.Page, request.PageSize);

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

    public async Task<ApiResponse<List<ProductResponseDto>>> GetProductsByIdsAsync(List<int> ids)
    {
        try
        {
            if (ids == null || ids.Count == 0)
            {
                return ApiResponse<List<ProductResponseDto>>.Error("Ids list cannot be empty", 400);
            }

            var products = await _unitOfWork.Products.GetQueryable()
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .Include(p => p.Inventory)
                .Where(p => ids.Contains(p.Id))
                .ToListAsync();

            var productDtos = _mapper.Map<List<ProductResponseDto>>(products);
            return ApiResponse<List<ProductResponseDto>>.Success(productDtos);
        }
        catch (Exception ex)
        {
            return ApiResponse<List<ProductResponseDto>>.Error(ex.Message);
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

            // Check if barcode already exists (excluding current product) - only if barcode is being updated
            if (!string.IsNullOrEmpty(request.Barcode))
            {
                var existingProduct = await _unitOfWork.Products.GetQueryable()
                    .FirstOrDefaultAsync(p => p.Barcode == request.Barcode && p.Id != id);

                if (existingProduct != null)
                {
                    return ApiResponse<ProductResponseDto>.Error("Barcode already exists", 409);
                }
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
            var product = await _unitOfWork.Products.GetQueryable()
                .Include(p => p.OrderItems)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return ApiResponse<bool>.Error("Không tìm thấy sản phẩm", 404);
            }

            // Kiểm tra xem Product có OrderItems không
            var orderItemCount = product.OrderItems.Count;
            if (orderItemCount > 0)
            {
                return ApiResponse<bool>.Error(
                    $"Không thể xóa sản phẩm này vì đang có {orderItemCount} chi tiết đơn hàng liên quan. " +
                    "Vui lòng xóa các đơn hàng liên quan trước khi xóa sản phẩm.",
                    400
                );
            }

            await _unitOfWork.Products.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Xóa sản phẩm thành công");
        }
        catch (DbUpdateException dbEx)
        {
            // Xử lý lỗi database constraint violation
            if (dbEx.InnerException is PostgresException pgEx)
            {
                // Lỗi foreign key constraint violation (23503) hoặc not null constraint (23502)
                if (pgEx.SqlState == "23503" || pgEx.SqlState == "23502")
                {
                    return ApiResponse<bool>.Error(
                        "Không thể xóa sản phẩm này vì đang có chi tiết đơn hàng liên quan. " +
                        "Vui lòng xóa các đơn hàng liên quan trước khi xóa sản phẩm.",
                        400
                    );
                }
            }

            return ApiResponse<bool>.Error(
                "Lỗi khi xóa sản phẩm. Vui lòng thử lại hoặc liên hệ quản trị viên.",
                500
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(
                $"Lỗi không xác định: {ex.Message}",
                500
            );
        }
    }
}
