using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Inventory;
using static RetailStoreManagement.Common.InventoryConstants;

namespace RetailStoreManagement.Services;

public class InventoryService : IInventoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public InventoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<InventoryResponseDto>>> GetInventoryAsync(InventorySearchRequest request)
    {
        try
        {
            var query = _unitOfWork.Inventory.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(i => i.Product.ProductName.Contains(request.Search) ||
                                        (i.Product.Barcode != null && i.Product.Barcode.Contains(request.Search)));
            }

            // Apply ProductId filter
            if (request.ProductId.HasValue)
            {
                query = query.Where(i => i.ProductId == request.ProductId.Value);
            }

            // Apply quantity filters
            if (request.MinQuantity.HasValue)
            {
                query = query.Where(i => i.Quantity >= request.MinQuantity.Value);
            }

            if (request.MaxQuantity.HasValue)
            {
                query = query.Where(i => i.Quantity <= request.MaxQuantity.Value);
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(i => EF.Property<object>(i, request.SortBy))
                : query.OrderBy(i => EF.Property<object>(i, request.SortBy));

            // Project to DTO and keep IQueryable
            var dtoQuery = query
                .Include(i => i.Product)
                .Select(i => new InventoryResponseDto
                {
                    InventoryId = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product.ProductName,
                    Barcode = i.Product.Barcode ?? string.Empty,
                    Quantity = i.Quantity,
                    UpdatedAt = i.UpdatedAt ?? i.CreatedAt,
                    Status = i.Quantity == 0 ? "out_of_stock" : (i.Quantity < LOW_STOCK_THRESHOLD ? "low_stock" : "in_stock")
                });

            // Use PagedList.CreateAsync for database-level pagination
            var pagedList = await PagedList<InventoryResponseDto>.CreateAsync(dtoQuery, request.Page, request.PageSize);

            return ApiResponse<PagedList<InventoryResponseDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<InventoryResponseDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<InventoryResponseDto>> GetInventoryByProductIdAsync(int productId)
    {
        try
        {
            var inventory = await _unitOfWork.Inventory.GetQueryable()
                .Include(i => i.Product)
                .FirstOrDefaultAsync(i => i.ProductId == productId);

            if (inventory == null)
            {
                return ApiResponse<InventoryResponseDto>.Error("Inventory not found", 404);
            }

            var inventoryDto = _mapper.Map<InventoryResponseDto>(inventory);
            return ApiResponse<InventoryResponseDto>.Success(inventoryDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<InventoryResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<InventoryResponseDto>> UpdateInventoryAsync(int productId, UpdateInventoryRequest request, int userId)
    {
        try
        {
            var inventory = await _unitOfWork.Inventory.GetQueryable()
                .Include(i => i.Product)
                .FirstOrDefaultAsync(i => i.ProductId == productId);

            if (inventory == null)
            {
                return ApiResponse<InventoryResponseDto>.Error("Inventory not found", 404);
            }

            if (!request.QuantityChange.HasValue)
            {
                return ApiResponse<InventoryResponseDto>.Error("QuantityChange is required", 400);
            }

            var newQuantity = inventory.Quantity + request.QuantityChange.Value;
            if (newQuantity < 0)
            {
                return ApiResponse<InventoryResponseDto>.Error("Insufficient inventory quantity", 400);
            }

            var oldQuantity = inventory.Quantity;
            inventory.Quantity = newQuantity;
            inventory.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.Inventory.UpdateAsync(inventory);

            // Log inventory history
            var history = new InventoryHistoryEntity
            {
                ProductId = productId,
                UserId = userId,
                QuantityChange = request.QuantityChange!.Value,
                QuantityAfter = newQuantity,
                Reason = request.Reason ?? string.Empty
            };
            await _unitOfWork.InventoryHistories.AddAsync(history);

            await _unitOfWork.SaveChangesAsync();

            var inventoryDto = _mapper.Map<InventoryResponseDto>(inventory);
            return ApiResponse<InventoryResponseDto>.Success(inventoryDto, "Inventory updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<InventoryResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<List<LowStockAlertDto>>> GetLowStockAlertsAsync()
    {
        try
        {
            var lowStockItems = await _unitOfWork.Inventory.GetQueryable()
                .Include(i => i.Product)
                .Where(i => i.Quantity < LOW_STOCK_THRESHOLD)
                .ToListAsync();

            var alertDtos = lowStockItems.Select(i => new LowStockAlertDto
            {
                ProductId = i.ProductId,
                ProductName = i.Product.ProductName,
                Barcode = i.Product.Barcode ?? "",
                CurrentQuantity = i.Quantity,
                Threshold = LOW_STOCK_THRESHOLD
            }).ToList();

            return ApiResponse<List<LowStockAlertDto>>.Success(alertDtos);
        }
        catch (Exception ex)
        {
            return ApiResponse<List<LowStockAlertDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<PagedList<InventoryHistoryDto>>> GetInventoryHistoryAsync(int productId, PagedRequest request)
    {
        try
        {
            var query = _unitOfWork.InventoryHistories.GetQueryable()
                .Where(h => h.ProductId == productId);

            // Apply sorting
            var sortedQuery = request.SortDesc
                ? query.OrderByDescending(h => EF.Property<object>(h, request.SortBy))
                : query.OrderBy(h => EF.Property<object>(h, request.SortBy));

            query = sortedQuery.Include(h => h.Product).Include(h => h.User);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var historyDtos = _mapper.Map<List<InventoryHistoryDto>>(items);
            var pagedList = new PagedList<InventoryHistoryDto>(historyDtos, request.Page, request.PageSize, totalCount);

            return ApiResponse<PagedList<InventoryHistoryDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<InventoryHistoryDto>>.Error(ex.Message);
        }
    }
}
