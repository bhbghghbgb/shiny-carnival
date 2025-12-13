using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Order;
using RetailStoreManagement.Enums;
using System.Security.Claims;

namespace RetailStoreManagement.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<OrderListDto>>> GetOrdersAsync(OrderSearchRequest request)
    {
        try
        {
            var query = _unitOfWork.Orders.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(o => o.Customer!.Name.Contains(request.Search) ||
                                        o.User.FullName!.Contains(request.Search));
            }

            // Apply status filter
            if (!string.IsNullOrEmpty(request.Status))
            {
                if (Enum.TryParse<OrderStatus>(request.Status, true, out var status))
                {
                    query = query.Where(o => o.Status == status);
                }
            }

            // Apply customer filter
            if (request.CustomerId.HasValue)
            {
                query = query.Where(o => o.CustomerId == request.CustomerId.Value);
            }

            // Apply user filter
            if (request.UserId.HasValue)
            {
                query = query.Where(o => o.UserId == request.UserId.Value);
            }

            // Apply date filters
            if (request.StartDate.HasValue)
            {
                query = query.Where(o => o.OrderDate >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(o => o.OrderDate <= request.EndDate.Value);
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(o => EF.Property<object>(o, request.SortBy))
                : query.OrderBy(o => EF.Property<object>(o, request.SortBy));

            // Project to DTO and keep IQueryable
            var dtoQuery = query
                .Include(o => o.Customer)
                .Include(o => o.User)
                .Select(o => new OrderListDto
                {
                    Id = o.Id,
                    OrderDate = o.OrderDate,
                    CustomerName = o.Customer != null ? o.Customer.Name : string.Empty,
                    StaffName = o.User.FullName ?? string.Empty,
                    Status = o.Status.ToString().ToLower(),
                    TotalAmount = o.TotalAmount,
                    DiscountAmount = o.DiscountAmount,
                    FinalAmount = o.TotalAmount - o.DiscountAmount
                });

            // Use PagedList.CreateAsync for database-level pagination
            var pagedList = await PagedList<OrderListDto>.CreateAsync(dtoQuery, request.Page, request.PageSize);

            return ApiResponse<PagedList<OrderListDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<OrderListDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<OrderDetailsDto>> GetOrderByIdAsync(int id)
    {
        try
        {
            var order = await _unitOfWork.Orders.GetQueryable()
                .Include(o => o.Customer)
                .Include(o => o.User)
                .Include(o => o.Promotion)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return ApiResponse<OrderDetailsDto>.Error("Order not found", 404);
            }

            var orderDto = _mapper.Map<OrderDetailsDto>(order);
            return ApiResponse<OrderDetailsDto>.Success(orderDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<OrderDetailsDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<OrderDetailsDto>> CreateOrderAsync(CreateOrderRequest request, int userId)
    {
        try
        {
            // 1. Validate customer exists
            var customer = await _unitOfWork.Customers.GetByIdAsync(request.CustomerId);
            if (customer == null)
            {
                return ApiResponse<OrderDetailsDto>.Error("Customer not found", 404);
            }

            // 2. Validate all products exist and have sufficient stock
            var productIds = request.OrderItems.Select(oi => oi.ProductId).ToList();
            var products = await _unitOfWork.Products.GetQueryable()
                .Include(p => p.Inventory)
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            if (products.Count != productIds.Count)
            {
                return ApiResponse<OrderDetailsDto>.Error("One or more products not found", 404);
            }

            foreach (var orderItem in request.OrderItems)
            {
                var product = products.First(p => p.Id == orderItem.ProductId);
                if (product.Inventory == null || product.Inventory.Quantity < orderItem.Quantity)
                {
                    return ApiResponse<OrderDetailsDto>.Error($"Insufficient stock for product {product.ProductName}", 400);
                }
            }

            // 3. Apply promotion if promoCode provided
            PromotionEntity? promotion = null;
            decimal discountAmount = 0;

            if (!string.IsNullOrEmpty(request.PromoCode))
            {
                promotion = await _unitOfWork.Promotions.GetQueryable()
                    .FirstOrDefaultAsync(p => p.PromoCode == request.PromoCode);

                if (promotion != null)
                {
                    // Validate basic promotion conditions (status, date, usage limit) - không cần totalAmount
                    var basicValidationResult = ValidatePromotionBasic(promotion);
                    if (!basicValidationResult.isValid)
                    {
                        return ApiResponse<OrderDetailsDto>.Error(basicValidationResult.message, 400);
                    }
                }
                else
                {
                    return ApiResponse<OrderDetailsDto>.Error("Promotion code not found", 404);
                }
            }

            // 4. Calculate totals
            decimal totalAmount = 0;
            var orderItems = new List<OrderItemEntity>();

            foreach (var orderItemRequest in request.OrderItems)
            {
                var product = products.First(p => p.Id == orderItemRequest.ProductId);
                var subtotal = product.Price * orderItemRequest.Quantity;
                totalAmount += subtotal;

                var orderItem = new OrderItemEntity
                {
                    ProductId = orderItemRequest.ProductId,
                    Quantity = orderItemRequest.Quantity,
                    Price = product.Price,
                    Subtotal = subtotal
                };
                orderItems.Add(orderItem);
            }

            // Apply discount if promotion is valid - validate với totalAmount đã tính
            if (promotion != null)
            {
                var validationResult = ValidatePromotion(promotion, totalAmount);
                if (!validationResult.isValid)
                {
                    return ApiResponse<OrderDetailsDto>.Error(validationResult.message, 400);
                }
                discountAmount = CalculateDiscount(promotion, totalAmount);
            }

            // 5. Create order
            var order = new OrderEntity
            {
                CustomerId = request.CustomerId,
                UserId = userId,
                PromoId = promotion?.Id,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                TotalAmount = totalAmount,
                DiscountAmount = discountAmount
            };

            await _unitOfWork.Orders.AddAsync(order);
            await _unitOfWork.SaveChangesAsync();

            // 6. Create order items
            foreach (var orderItem in orderItems)
            {
                orderItem.OrderId = order.Id;
                await _unitOfWork.OrderItems.AddAsync(orderItem);
            }

            // 7. If promotion applied, increment usedCount
            if (promotion != null && discountAmount > 0)
            {
                promotion.UsedCount++;
                await _unitOfWork.Promotions.UpdateAsync(promotion);
            }

            await _unitOfWork.SaveChangesAsync();

            // 8. Return OrderDetailsDto
            var createdOrder = await GetOrderByIdAsync(order.Id);
            return createdOrder;
        }
        catch (Exception ex)
        {
            return ApiResponse<OrderDetailsDto>.Error(ex.Message);
        }
    }

    /// <summary>
    /// Validate basic promotion conditions (status, date, usage limit) - không cần totalAmount
    /// </summary>
    private (bool isValid, string message) ValidatePromotionBasic(PromotionEntity promotion)
    {
        if (promotion.Status != PromotionStatus.Active)
            return (false, "Promotion is not active");

        var now = DateTime.UtcNow;
        var startDate = promotion.StartDate.ToDateTime(TimeOnly.MinValue);
        var endDate = promotion.EndDate.ToDateTime(TimeOnly.MaxValue);

        if (now < startDate || now > endDate)
            return (false, "Promotion is not valid for current date");

        if (promotion.UsageLimit > 0 && promotion.UsedCount >= promotion.UsageLimit)
            return (false, "Promotion usage limit exceeded");

        return (true, "Valid");
    }

    /// <summary>
    /// Validate promotion với totalAmount (bao gồm cả minOrderAmount check)
    /// </summary>
    private (bool isValid, string message) ValidatePromotion(PromotionEntity promotion, decimal orderTotal)
    {
        // Validate basic conditions first
        var basicValidation = ValidatePromotionBasic(promotion);
        if (!basicValidation.isValid)
            return basicValidation;

        // Validate minOrderAmount
        if (orderTotal < promotion.MinOrderAmount)
            return (false, $"Order amount must be at least {promotion.MinOrderAmount:C}");

        return (true, "Valid");
    }

    private decimal CalculateDiscount(PromotionEntity promotion, decimal orderTotal)
    {
        return promotion.DiscountType switch
        {
            DiscountType.Percent => orderTotal * (promotion.DiscountValue / 100),
            DiscountType.Fixed => promotion.DiscountValue,
            _ => 0
        };
    }

    public async Task<ApiResponse<OrderResponseDto>> UpdateOrderStatusAsync(int id, UpdateOrderStatusRequest request)
    {
        try
        {
            var order = await _unitOfWork.Orders.GetQueryable()
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.Inventory)
                .Include(o => o.Promotion)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return ApiResponse<OrderResponseDto>.Error("Order not found", 404);
            }

            var newStatus = request.Status.ToLower() switch
            {
                "pending" => OrderStatus.Pending,
                "paid" => OrderStatus.Paid,
                "canceled" => OrderStatus.Canceled,
                _ => throw new ArgumentException("Invalid status")
            };

            // Nếu status không thay đổi, không cần làm gì
            if (order.Status == newStatus)
            {
                var unchangedOrderDto = _mapper.Map<OrderResponseDto>(order);
                return ApiResponse<OrderResponseDto>.Success(unchangedOrderDto, "Order status unchanged");
            }

            // Handle status transitions
            if (order.Status == OrderStatus.Pending && newStatus == OrderStatus.Paid)
            {
                // Pending → Paid: Decrease inventory and create payment
                foreach (var orderItem in order.OrderItems)
                {
                    if (orderItem.Product.Inventory != null)
                    {
                        orderItem.Product.Inventory.Quantity -= orderItem.Quantity;
                        await _unitOfWork.Inventory.UpdateAsync(orderItem.Product.Inventory);
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
                await _unitOfWork.Payments.AddAsync(payment);
            }
            else if (order.Status == OrderStatus.Paid && newStatus == OrderStatus.Pending)
            {
                // Paid → Pending: Rollback inventory, delete payment, and decrement promotion
                foreach (var orderItem in order.OrderItems)
                {
                    if (orderItem.Product.Inventory != null)
                    {
                        orderItem.Product.Inventory.Quantity += orderItem.Quantity;
                        await _unitOfWork.Inventory.UpdateAsync(orderItem.Product.Inventory);
                    }
                }

                // Delete payment record
                var payment = await _unitOfWork.Payments.GetQueryable()
                    .FirstOrDefaultAsync(p => p.OrderId == order.Id);
                if (payment != null)
                {
                    await _unitOfWork.Payments.DeleteAsync(payment.Id);
                }

                // Decrement promotion usedCount if was applied
                if (order.Promotion != null && order.DiscountAmount > 0)
                {
                    order.Promotion.UsedCount--;
                    await _unitOfWork.Promotions.UpdateAsync(order.Promotion);
                }
            }
            else if (order.Status == OrderStatus.Pending && newStatus == OrderStatus.Canceled)
            {
                // Pending → Canceled: Decrement promotion usedCount if was applied
                if (order.Promotion != null && order.DiscountAmount > 0)
                {
                    order.Promotion.UsedCount--;
                    await _unitOfWork.Promotions.UpdateAsync(order.Promotion);
                }
            }
            else if (order.Status == OrderStatus.Paid && newStatus == OrderStatus.Canceled)
            {
                // Paid → Canceled: Rollback inventory, delete payment, and decrement promotion
                foreach (var orderItem in order.OrderItems)
                {
                    if (orderItem.Product.Inventory != null)
                    {
                        orderItem.Product.Inventory.Quantity += orderItem.Quantity;
                        await _unitOfWork.Inventory.UpdateAsync(orderItem.Product.Inventory);
                    }
                }

                // Delete payment record
                var payment = await _unitOfWork.Payments.GetQueryable()
                    .FirstOrDefaultAsync(p => p.OrderId == order.Id);
                if (payment != null)
                {
                    await _unitOfWork.Payments.DeleteAsync(payment.Id);
                }

                // Decrement promotion usedCount if was applied
                if (order.Promotion != null && order.DiscountAmount > 0)
                {
                    order.Promotion.UsedCount--;
                    await _unitOfWork.Promotions.UpdateAsync(order.Promotion);
                }
            }
            else if (order.Status == OrderStatus.Canceled)
            {
                // Cannot change status from Canceled
                return ApiResponse<OrderResponseDto>.Error("Cannot change status of canceled orders", 400);
            }

            order.Status = newStatus;
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            var orderDto = _mapper.Map<OrderResponseDto>(order);
            return ApiResponse<OrderResponseDto>.Success(orderDto, "Order status updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<OrderResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<OrderItemResponseDto>> AddOrderItemAsync(int orderId, AddOrderItemRequest request)
    {
        try
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Order not found", 404);
            }

            if (order.Status != OrderStatus.Pending)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Can only modify pending orders", 400);
            }

            var product = await _unitOfWork.Products.GetQueryable()
                .Include(p => p.Inventory)
                .FirstOrDefaultAsync(p => p.Id == request.ProductId);

            if (product == null)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Product not found", 404);
            }

            if (product.Inventory == null || product.Inventory.Quantity < request.Quantity)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Insufficient stock", 400);
            }

            var orderItem = new OrderItemEntity
            {
                OrderId = orderId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Price = product.Price,
                Subtotal = product.Price * request.Quantity
            };

            await _unitOfWork.OrderItems.AddAsync(orderItem);

            // Update order total
            order.TotalAmount += orderItem.Subtotal;
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();

            var orderItemDto = _mapper.Map<OrderItemResponseDto>(orderItem);
            return ApiResponse<OrderItemResponseDto>.Success(orderItemDto, "Order item added successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<OrderItemResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<OrderItemResponseDto>> UpdateOrderItemAsync(int orderId, int itemId, UpdateOrderItemRequest request)
    {
        try
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Order not found", 404);
            }

            if (order.Status != OrderStatus.Pending)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Can only modify pending orders", 400);
            }

            var orderItem = await _unitOfWork.OrderItems.GetByIdAsync(itemId);
            if (orderItem == null || orderItem.OrderId != orderId)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Order item not found", 404);
            }

            var product = await _unitOfWork.Products.GetQueryable()
                .Include(p => p.Inventory)
                .FirstOrDefaultAsync(p => p.Id == orderItem.ProductId);

            if (product == null)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Product not found", 404);
            }

            var quantityChange = request.Quantity - orderItem.Quantity;
            if (product.Inventory == null || product.Inventory.Quantity < quantityChange)
            {
                return ApiResponse<OrderItemResponseDto>.Error("Insufficient stock", 400);
            }

            var oldSubtotal = orderItem.Subtotal;
            orderItem.Quantity = request.Quantity;
            orderItem.Subtotal = orderItem.Price * request.Quantity;
            await _unitOfWork.OrderItems.UpdateAsync(orderItem);

            // Update order total
            order.TotalAmount = order.TotalAmount - oldSubtotal + orderItem.Subtotal;
            await _unitOfWork.Orders.UpdateAsync(order);

            await _unitOfWork.SaveChangesAsync();

            var orderItemDto = _mapper.Map<OrderItemResponseDto>(orderItem);
            return ApiResponse<OrderItemResponseDto>.Success(orderItemDto, "Order item updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<OrderItemResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<bool>> DeleteOrderItemAsync(int orderId, int itemId)
    {
        try
        {
            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null)
            {
                return ApiResponse<bool>.Error("Order not found", 404);
            }

            if (order.Status != OrderStatus.Pending)
            {
                return ApiResponse<bool>.Error("Can only modify pending orders", 400);
            }

            var orderItem = await _unitOfWork.OrderItems.GetByIdAsync(itemId);
            if (orderItem == null || orderItem.OrderId != orderId)
            {
                return ApiResponse<bool>.Error("Order item not found", 404);
            }

            // Update order total
            order.TotalAmount -= orderItem.Subtotal;
            await _unitOfWork.Orders.UpdateAsync(order);

            await _unitOfWork.OrderItems.DeleteAsync(itemId);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Order item deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(ex.Message);
        }
    }

    public async Task<byte[]> GenerateInvoicePdfAsync(int orderId)
    {
        // Placeholder for PDF generation logic.
        // A library like QuestPDF or iTextSharp would be used here.
        var orderDetails = await GetOrderByIdAsync(orderId);
        if (orderDetails.IsError || orderDetails.Data == null)
        {
            throw new Exception("Order not found or error retrieving order details.");
        }

        if (orderDetails.Data.Status.ToLower() != "paid")
        {
            throw new Exception("Invoice can only be generated for paid orders.");
        }

        var content = $"Invoice for Order #{orderDetails.Data.Id}\n\n" +
                      $"Customer: {orderDetails.Data.CustomerName}\n" +
                      $"Date: {orderDetails.Data.OrderDate:yyyy-MM-dd}\n\n" +
                      "Items:\n";

        foreach (var item in orderDetails.Data.OrderItems)
        {
            content += $"- {item.ProductName} x {item.Quantity} @ {item.Price:C} = {item.Subtotal:C}\n";
        }

        content += $"\nTotal: {orderDetails.Data.TotalAmount:C}\n";
        content += $"Discount: {orderDetails.Data.DiscountAmount:C}\n";
        content += $"Final Amount: {orderDetails.Data.FinalAmount:C}\n";

        return System.Text.Encoding.UTF8.GetBytes(content);
    }

    public async Task<ApiResponse<decimal>> GetTotalRevenueAsync(OrderRevenueRequest? request = null)
    {
        try
        {
            var query = _unitOfWork.Orders.GetQueryable();

            // Apply same filters as GetOrdersAsync if request provided
            if (request != null)
            {
                // Apply search filter
                if (!string.IsNullOrEmpty(request.Search))
                {
                    query = query.Where(o => o.Customer!.Name.Contains(request.Search) ||
                                            o.User.FullName!.Contains(request.Search));
                }

                // Apply status filter
                if (!string.IsNullOrEmpty(request.Status))
                {
                    if (Enum.TryParse<OrderStatus>(request.Status, true, out var status))
                    {
                        query = query.Where(o => o.Status == status);
                    }
                }
                // Todo: nên bỏ tổng doanh thu vào trong database
                else
                {
                    // Default: Only calculate revenue from Paid orders (if no status filter specified)
                    query = query.Where(o => o.Status == OrderStatus.Paid);
                }

                // Apply customer filter
                if (request.CustomerId.HasValue)
                {
                    query = query.Where(o => o.CustomerId == request.CustomerId.Value);
                }

                // Apply user filter
                if (request.UserId.HasValue)
                {
                    query = query.Where(o => o.UserId == request.UserId.Value);
                }

                // Apply date filters
                if (request.StartDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate >= request.StartDate.Value);
                }

                if (request.EndDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate <= request.EndDate.Value);
                }
            }
            else
            {
                // If no request provided, default to only Paid orders
                query = query.Where(o => o.Status == OrderStatus.Paid);
            }

            // Calculate total revenue: sum of (TotalAmount - DiscountAmount) = FinalAmount
            var totalRevenue = await query
                .Select(o => o.TotalAmount - o.DiscountAmount)
                .SumAsync();

            return ApiResponse<decimal>.Success(totalRevenue);
        }
        catch (Exception ex)
        {
            return ApiResponse<decimal>.Error(ex.Message);
        }
    }
}
