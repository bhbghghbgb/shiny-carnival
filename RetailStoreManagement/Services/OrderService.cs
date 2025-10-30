using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Enums;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Orders;
using System.Text;

namespace RetailStoreManagement.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IPromotionService _promotionService;

    public OrderService(ApplicationDbContext context, IMapper mapper, IPromotionService promotionService)
    {
        _context = context;
        _mapper = mapper;
        _promotionService = promotionService;
    }

    public async Task<ApiResponse<OrderDetailsDto>> GetByIdAsync(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.User)
            .Include(o => o.Promotion)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted);

        if (order == null)
            return ApiResponse<OrderDetailsDto>.Fail("Order not found");

        var dto = _mapper.Map<OrderDetailsDto>(order);
        return ApiResponse<OrderDetailsDto>.Success(dto);
    }

    public async Task<ApiResponse<PagedList<OrderListDto>>> GetPagedAsync(OrderSearchRequest request)
    {
        var query = _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(o => o.Customer!.Name.Contains(request.Search) || 
                                    o.User.FullName!.Contains(request.Search));
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (Enum.TryParse<OrderStatus>(request.Status, true, out var status))
            {
                query = query.Where(o => o.Status == status);
            }
        }

        if (request.CustomerId.HasValue)
        {
            query = query.Where(o => o.CustomerId == request.CustomerId.Value);
        }

        if (request.UserId.HasValue)
        {
            query = query.Where(o => o.UserId == request.UserId.Value);
        }

        if (request.StartDate.HasValue)
        {
            query = query.Where(o => o.OrderDate >= request.StartDate.Value);
        }

        if (request.EndDate.HasValue)
        {
            query = query.Where(o => o.OrderDate <= request.EndDate.Value);
        }

        var totalCount = await query.CountAsync();

        query = request.SortDesc 
            ? query.OrderByDescending(o => EF.Property<object>(o, request.SortBy))
            : query.OrderBy(o => EF.Property<object>(o, request.SortBy));

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<OrderListDto>>(items);
        var pagedList = new PagedList<OrderListDto>(dtos, totalCount, request.Page, request.PageSize);

        return ApiResponse<PagedList<OrderListDto>>.Success(pagedList);
    }

    public async Task<ApiResponse<OrderDetailsDto>> CreateAsync(CreateOrderRequest request, int userId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // 1. Validate customer
            var customer = await _context.Customers.FindAsync(request.CustomerId);
            if (customer == null || customer.IsDeleted)
                return ApiResponse<OrderDetailsDto>.Fail("Customer not found");

            // 2. Validate products and check stock
            var productIds = request.OrderItems.Select(oi => oi.ProductId).ToList();
            var products = await _context.Products
                .Include(p => p.Inventory)
                .Where(p => productIds.Contains(p.Id) && !p.IsDeleted)
                .ToListAsync();

            if (products.Count != productIds.Distinct().Count())
                return ApiResponse<OrderDetailsDto>.Fail("One or more products not found");

            foreach (var item in request.OrderItems)
            {
                var product = products.First(p => p.Id == item.ProductId);
                if (product.Inventory == null || product.Inventory.Quantity < item.Quantity)
                    return ApiResponse<OrderDetailsDto>.Fail($"Insufficient stock for product: {product.ProductName}");
            }

            // 3. Calculate total
            decimal totalAmount = 0;
            foreach (var item in request.OrderItems)
            {
                var product = products.First(p => p.Id == item.ProductId);
                totalAmount += product.Price * item.Quantity;
            }

            // 4. Apply promotion if provided
            decimal discountAmount = 0;
            int? promoId = null;

            if (!string.IsNullOrWhiteSpace(request.PromoCode))
            {
                var validateResult = await _promotionService.ValidatePromoCodeAsync(new Models.DTOs.Promotions.ValidatePromoRequest
                {
                    PromoCode = request.PromoCode,
                    OrderAmount = totalAmount
                });

                if (!validateResult.Data!.IsValid)
                    return ApiResponse<OrderDetailsDto>.Fail(validateResult.Data.Message);

                discountAmount = validateResult.Data.DiscountAmount;
                promoId = validateResult.Data.PromoId;
            }

            // 5. Create order
            var order = new OrderEntity
            {
                CustomerId = request.CustomerId,
                UserId = userId,
                PromoId = promoId,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                TotalAmount = totalAmount,
                DiscountAmount = discountAmount
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // 6. Create order items
            foreach (var item in request.OrderItems)
            {
                var product = products.First(p => p.Id == item.ProductId);
                var orderItem = new OrderItemEntity
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = product.Price,
                    Subtotal = product.Price * item.Quantity
                };
                _context.OrderItems.Add(orderItem);
            }

            // 7. Increment promotion used count
            if (promoId.HasValue)
            {
                var promotion = await _context.Promotions.FindAsync(promoId.Value);
                if (promotion != null)
                {
                    promotion.UsedCount++;
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Reload with includes
            var result = await GetByIdAsync(order.Id);
            return result;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return ApiResponse<OrderDetailsDto>.Fail($"Failed to create order: {ex.Message}");
        }
    }

    public async Task<ApiResponse<OrderResponseDto>> UpdateStatusAsync(int id, UpdateOrderStatusRequest request, int userId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.Promotion)
                .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted);

            if (order == null)
                return ApiResponse<OrderResponseDto>.Fail("Order not found");

            if (order.Status != OrderStatus.Pending)
                return ApiResponse<OrderResponseDto>.Fail("Can only update status of pending orders");

            var newStatus = request.Status.ToLower() switch
            {
                "paid" => OrderStatus.Paid,
                "canceled" => OrderStatus.Canceled,
                _ => throw new ArgumentException("Invalid status")
            };

            if (newStatus == OrderStatus.Paid)
            {
                // Decrease inventory
                foreach (var item in order.OrderItems)
                {
                    var inventory = await _context.Inventories
                        .FirstOrDefaultAsync(i => i.ProductId == item.ProductId);
                    
                    if (inventory != null)
                    {
                        inventory.Quantity -= item.Quantity;
                        inventory.UpdatedAt = DateTime.UtcNow;

                        // Create history record
                        var history = new InventoryHistoryEntity
                        {
                            ProductId = item.ProductId,
                            QuantityChange = -item.Quantity,
                            QuantityAfter = inventory.Quantity,
                            Reason = $"Order #{order.Id} paid",
                            UserId = userId
                        };
                        _context.InventoryHistories.Add(history);
                    }
                }

                // Create payment record
                var payment = new PaymentEntity
                {
                    OrderId = order.Id,
                    Amount = order.TotalAmount - order.DiscountAmount,
                    PaymentMethod = PaymentMethod.Cash,
                    PaymentDate = DateTime.UtcNow
                };
                _context.Payments.Add(payment);
            }
            else if (newStatus == OrderStatus.Canceled)
            {
                // Decrement promotion used count if was applied
                if (order.PromoId.HasValue && order.Promotion != null)
                {
                    order.Promotion.UsedCount = Math.Max(0, order.Promotion.UsedCount - 1);
                }
            }

            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            // Reload with includes
            order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.User)
                .Include(o => o.Promotion)
                .FirstAsync(o => o.Id == id);

            var dto = _mapper.Map<OrderResponseDto>(order);
            return ApiResponse<OrderResponseDto>.Success(dto, $"Order status updated to {newStatus}");
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return ApiResponse<OrderResponseDto>.Fail($"Failed to update order status: {ex.Message}");
        }
    }

    public async Task<byte[]> GenerateInvoicePdfAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.User)
            .Include(o => o.Promotion)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            throw new Exception("Order not found");

        // Simple text-based invoice (in production, use a PDF library like QuestPDF or iTextSharp)
        var sb = new StringBuilder();
        sb.AppendLine("=== INVOICE ===");
        sb.AppendLine($"Order ID: {order.Id}");
        sb.AppendLine($"Date: {order.OrderDate:yyyy-MM-dd HH:mm}");
        sb.AppendLine($"Customer: {order.Customer?.Name}");
        sb.AppendLine($"Staff: {order.User.FullName}");
        sb.AppendLine();
        sb.AppendLine("Items:");
        foreach (var item in order.OrderItems)
        {
            sb.AppendLine($"  {item.Product.ProductName} x{item.Quantity} @ {item.Price:C} = {item.Subtotal:C}");
        }
        sb.AppendLine();
        sb.AppendLine($"Subtotal: {order.TotalAmount:C}");
        if (order.DiscountAmount > 0)
        {
            sb.AppendLine($"Discount ({order.Promotion?.PromoCode}): -{order.DiscountAmount:C}");
        }
        sb.AppendLine($"Total: {(order.TotalAmount - order.DiscountAmount):C}");
        sb.AppendLine($"Status: {order.Status}");

        return Encoding.UTF8.GetBytes(sb.ToString());
    }
}
