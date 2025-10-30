using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Products;

namespace RetailStoreManagement.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ProductService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ProductResponseDto>> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null)
            return ApiResponse<ProductResponseDto>.Fail("Product not found");

        var dto = _mapper.Map<ProductResponseDto>(product);
        return ApiResponse<ProductResponseDto>.Success(dto);
    }

    public async Task<ApiResponse<PagedList<ProductListDto>>> GetPagedAsync(ProductSearchRequest request)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(p => p.ProductName.Contains(request.Search) || 
                                    p.Barcode!.Contains(request.Search));
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);
        }

        if (request.SupplierId.HasValue)
        {
            query = query.Where(p => p.SupplierId == request.SupplierId.Value);
        }

        if (request.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= request.MaxPrice.Value);
        }

        var totalCount = await query.CountAsync();

        query = request.SortDesc 
            ? query.OrderByDescending(p => EF.Property<object>(p, request.SortBy))
            : query.OrderBy(p => EF.Property<object>(p, request.SortBy));

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<ProductListDto>>(items);
        var pagedList = new PagedList<ProductListDto>(dtos, totalCount, request.Page, request.PageSize);

        return ApiResponse<PagedList<ProductListDto>>.Success(pagedList);
    }

    public async Task<ApiResponse<ProductResponseDto>> CreateAsync(CreateProductRequest request)
    {
        if (await BarcodeExistsAsync(request.Barcode))
            return ApiResponse<ProductResponseDto>.Fail("Barcode already exists");

        var category = await _context.Categories.FindAsync(request.CategoryId);
        if (category == null || category.IsDeleted)
            return ApiResponse<ProductResponseDto>.Fail("Category not found");

        var supplier = await _context.Suppliers.FindAsync(request.SupplierId);
        if (supplier == null || supplier.IsDeleted)
            return ApiResponse<ProductResponseDto>.Fail("Supplier not found");

        var product = _mapper.Map<ProductEntity>(request);
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Create inventory entry
        var inventory = new InventoryEntity
        {
            ProductId = product.Id,
            Quantity = 0
        };
        _context.Inventories.Add(inventory);
        await _context.SaveChangesAsync();

        // Reload with includes
        product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .FirstAsync(p => p.Id == product.Id);

        var dto = _mapper.Map<ProductResponseDto>(product);
        return ApiResponse<ProductResponseDto>.Success(dto, "Product created successfully");
    }

    public async Task<ApiResponse<ProductResponseDto>> UpdateAsync(int id, UpdateProductRequest request)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null || product.IsDeleted)
            return ApiResponse<ProductResponseDto>.Fail("Product not found");

        if (await BarcodeExistsAsync(request.Barcode, id))
            return ApiResponse<ProductResponseDto>.Fail("Barcode already exists");

        var category = await _context.Categories.FindAsync(request.CategoryId);
        if (category == null || category.IsDeleted)
            return ApiResponse<ProductResponseDto>.Fail("Category not found");

        var supplier = await _context.Suppliers.FindAsync(request.SupplierId);
        if (supplier == null || supplier.IsDeleted)
            return ApiResponse<ProductResponseDto>.Fail("Supplier not found");

        product.CategoryId = request.CategoryId;
        product.SupplierId = request.SupplierId;
        product.ProductName = request.ProductName;
        product.Barcode = request.Barcode;
        product.Price = request.Price;
        product.Unit = request.Unit;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Reload with includes
        product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Supplier)
            .Include(p => p.Inventory)
            .FirstAsync(p => p.Id == id);

        var dto = _mapper.Map<ProductResponseDto>(product);
        return ApiResponse<ProductResponseDto>.Success(dto, "Product updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null || product.IsDeleted)
            return ApiResponse<bool>.Fail("Product not found");

        product.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Success(true, "Product deleted successfully");
    }

    public async Task<bool> BarcodeExistsAsync(string barcode, int? excludeId = null)
    {
        return await _context.Products
            .AnyAsync(p => p.Barcode == barcode && (!excludeId.HasValue || p.Id != excludeId.Value));
    }
}
