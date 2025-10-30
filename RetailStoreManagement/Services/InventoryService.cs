using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Inventory;

namespace RetailStoreManagement.Services;

public class InventoryService : IInventoryService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public InventoryService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<InventoryResponseDto>> GetByProductIdAsync(int productId)
    {
        var inventory = await _context.Inventories
            .Include(i => i.Product)
            .FirstOrDefaultAsync(i => i.ProductId == productId && !i.IsDeleted);

        if (inventory == null)
            return ApiResponse<InventoryResponseDto>.Fail("Inventory not found");

        var dto = _mapper.Map<InventoryResponseDto>(inventory);
        return ApiResponse<InventoryResponseDto>.Success(dto);
    }

    public async Task<ApiResponse<PagedList<InventoryResponseDto>>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.Inventories
            .Include(i => i.Product)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(i => i.Product.ProductName.Contains(request.Search) || 
                                    i.Product.Barcode!.Contains(request.Search));
        }

        var totalCount = await query.CountAsync();

        query = request.SortDesc 
            ? query.OrderByDescending(i => EF.Property<object>(i, request.SortBy))
            : query.OrderBy(i => EF.Property<object>(i, request.SortBy));

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<InventoryResponseDto>>(items);
        var pagedList = new PagedList<InventoryResponseDto>(dtos, totalCount, request.Page, request.PageSize);

        return ApiResponse<PagedList<InventoryResponseDto>>.Success(pagedList);
    }

    public async Task<ApiResponse<InventoryResponseDto>> UpdateAsync(int productId, UpdateInventoryRequest request, int userId)
    {
        var inventory = await _context.Inventories
            .Include(i => i.Product)
            .FirstOrDefaultAsync(i => i.ProductId == productId && !i.IsDeleted);

        if (inventory == null)
            return ApiResponse<InventoryResponseDto>.Fail("Inventory not found");

        var oldQuantity = inventory.Quantity;
        var newQuantity = oldQuantity + request.QuantityChange;

        if (newQuantity < 0)
            return ApiResponse<InventoryResponseDto>.Fail("Insufficient inventory quantity");

        inventory.Quantity = newQuantity;
        inventory.UpdatedAt = DateTime.UtcNow;

        // Create history record
        var history = new InventoryHistoryEntity
        {
            ProductId = productId,
            QuantityChange = request.QuantityChange,
            QuantityAfter = newQuantity,
            Reason = request.Reason,
            UserId = userId
        };
        _context.InventoryHistories.Add(history);

        await _context.SaveChangesAsync();

        var dto = _mapper.Map<InventoryResponseDto>(inventory);
        return ApiResponse<InventoryResponseDto>.Success(dto, "Inventory updated successfully");
    }

    public async Task<ApiResponse<List<LowStockAlertDto>>> GetLowStockAlertsAsync(int threshold = 10)
    {
        var lowStockItems = await _context.Inventories
            .Include(i => i.Product)
            .Where(i => i.Quantity < threshold && !i.IsDeleted)
            .ToListAsync();

        var dtos = lowStockItems.Select(i => new LowStockAlertDto
        {
            ProductId = i.ProductId,
            ProductName = i.Product.ProductName,
            Barcode = i.Product.Barcode ?? "",
            CurrentQuantity = i.Quantity,
            Threshold = threshold
        }).ToList();

        return ApiResponse<List<LowStockAlertDto>>.Success(dtos);
    }

    public async Task<ApiResponse<PagedList<InventoryHistoryDto>>> GetHistoryAsync(int productId, PagedRequest request)
    {
        var query = _context.InventoryHistories
            .Include(h => h.Product)
            .Include(h => h.User)
            .Where(h => h.ProductId == productId && !h.IsDeleted);

        var totalCount = await query.CountAsync();

        query = query.OrderByDescending(h => h.CreatedAt);

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<InventoryHistoryDto>>(items);
        var pagedList = new PagedList<InventoryHistoryDto>(dtos, totalCount, request.Page, request.PageSize);

        return ApiResponse<PagedList<InventoryHistoryDto>>.Success(pagedList);
    }

    public async Task UpdateInventoryForOrderAsync(int orderId, bool isDecrease)
    {
        var orderItems = await _context.OrderItems
            .Where(oi => oi.OrderId == orderId)
            .ToListAsync();

        foreach (var item in orderItems)
        {
            var inventory = await _context.Inventories
                .FirstOrDefaultAsync(i => i.ProductId == item.ProductId);

            if (inventory != null)
            {
                inventory.Quantity += isDecrease ? -item.Quantity : item.Quantity;
                inventory.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
    }
}
