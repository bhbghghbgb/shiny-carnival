using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Report;
using RetailStoreManagement.Enums;
using static RetailStoreManagement.Common.ReportConstants;

namespace RetailStoreManagement.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ReportService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<RevenueReportDto>> GetRevenueReportAsync(RevenueReportRequest request)
    {
        try
        {
            var query = _unitOfWork.Orders.GetQueryable()
                .Where(o => o.Status == OrderStatus.Paid && 
                            o.OrderDate >= request.StartDate && 
                            o.OrderDate <= request.EndDate);

            var summary = await query.GroupBy(o => 1)
                .Select(g => new RevenueSummaryDto
                {
                    OverallRevenue = g.Sum(o => o.TotalAmount - o.DiscountAmount),
                    OverallOrders = g.Count(),
                    OverallDiscount = g.Sum(o => o.DiscountAmount),
                    AverageOrderValue = g.Average(o => o.TotalAmount - o.DiscountAmount),
                    Period = $"{request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd}"
                }).FirstOrDefaultAsync() ?? new RevenueSummaryDto();

            // Group by period using inline conditional expressions that EF Core can translate
            // Cannot use custom method GetGroupByKey as EF Core cannot translate it to SQL
            // Fetch orders first, then group in memory to avoid EF Core translation issues
            // This allows us to use custom grouping logic that EF Core cannot translate
            var orders = await query.ToListAsync();
            
            var details = orders
                .GroupBy(o => GetGroupByKey(o.OrderDate, request.GroupBy))
                .Select(g => new RevenueDetailDto
                {
                    Period = g.Key,
                    TotalRevenue = g.Sum(o => o.TotalAmount - o.DiscountAmount),
                    TotalOrders = g.Count(),
                    TotalDiscount = g.Sum(o => o.DiscountAmount),
                    AverageOrderValue = g.Average(o => o.TotalAmount - o.DiscountAmount),
                    Date = g.Min(o => o.OrderDate)
                })
                .OrderBy(d => d.Date)
                .ToList();

            var report = new RevenueReportDto
            {
                Summary = summary,
                Details = details
            };

            return ApiResponse<RevenueReportDto>.Success(report);
        }
        catch (Exception ex)
        {
            return ApiResponse<RevenueReportDto>.Error(ex.Message);
        }
    }

    private string GetGroupByKey(DateTime date, string groupBy)
    {
        return groupBy.ToLower() switch
        {
            "week" => $"{date.Year}-W{GetIso8601WeekOfYear(date)}",
            "month" => date.ToString("yyyy-MM"),
            _ => date.ToString("yyyy-MM-dd")
        };
    }

    private static int GetIso8601WeekOfYear(DateTime time)
    {
        DayOfWeek day = System.Globalization.CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
        if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday)
        {
            time = time.AddDays(3);
        }
        return System.Globalization.CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
    }

    public async Task<ApiResponse<SalesReportDto>> GetSalesReportAsync(SalesReportRequest request)
    {
        try
        {
            var topProductsRequest = new TopProductsSearchRequest
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Page = ReportConstants.DEFAULT_TOP_ITEMS_PAGE,
                PageSize = ReportConstants.DEFAULT_TOP_ITEMS_PAGE_SIZE
            };
            var topProducts = await GetTopProductsAsync(topProductsRequest);

            var topCustomersRequest = new TopCustomersSearchRequest
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Page = ReportConstants.DEFAULT_TOP_ITEMS_PAGE,
                PageSize = ReportConstants.DEFAULT_TOP_ITEMS_PAGE_SIZE
            };
            var topCustomers = await GetTopCustomersAsync(topCustomersRequest);

            var categoryBreakdown = await _unitOfWork.OrderItems.GetQueryable()
                .Include(oi => oi.Order)
                .Include(oi => oi.Product)
                    .ThenInclude(p => p.Category)
                .Where(oi => oi.Order.Status == OrderStatus.Paid &&
                             oi.Order.OrderDate >= request.StartDate &&
                             oi.Order.OrderDate <= request.EndDate)
                .GroupBy(oi => new { oi.Product.CategoryId, oi.Product.Category.CategoryName })
                .Select(g => new CategorySalesDto
                {
                    CategoryId = g.Key.CategoryId,
                    CategoryName = g.Key.CategoryName,
                    TotalRevenue = g.Sum(oi => oi.Subtotal),
                    TotalQuantitySold = g.Sum(oi => oi.Quantity),
                    ProductCount = g.Select(oi => oi.ProductId).Distinct().Count()
                })
                .ToListAsync();

            var report = new SalesReportDto
            {
                TopProducts = topProducts.Data?.Items?.ToList() ?? new List<TopProductDto>(),
                TopCustomers = topCustomers.Data?.Items?.ToList() ?? new List<TopCustomerDto>(),
                CategoryBreakdown = categoryBreakdown
            };

            return ApiResponse<SalesReportDto>.Success(report);
        }
        catch (Exception ex)
        {
            return ApiResponse<SalesReportDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<PagedList<TopProductDto>>> GetTopProductsAsync(TopProductsSearchRequest request)
    {
        try
        {
            var query = _unitOfWork.OrderItems.GetQueryable()
                .Include(oi => oi.Order)
                .Include(oi => oi.Product)
                .Where(oi => oi.Order.Status == OrderStatus.Paid &&
                             oi.Order.OrderDate >= request.StartDate &&
                             oi.Order.OrderDate <= request.EndDate)
                .GroupBy(oi => new { oi.ProductId, oi.Product.ProductName })
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.ProductName,
                    TotalQuantitySold = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.Subtotal),
                    OrderCount = g.Select(oi => oi.OrderId).Distinct().Count()
                })
                .OrderByDescending(p => p.TotalRevenue);

            var pagedResult = await PagedList<TopProductDto>.CreateAsync(query, request.Page, request.PageSize);
            
            return ApiResponse<PagedList<TopProductDto>>.Success(pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<TopProductDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<PagedList<TopCustomerDto>>> GetTopCustomersAsync(TopCustomersSearchRequest request)
    {
        try
        {
            var query = _unitOfWork.Orders.GetQueryable()
                .Include(o => o.Customer)
                .Where(o => o.Status == OrderStatus.Paid &&
                             o.OrderDate >= request.StartDate &&
                             o.OrderDate <= request.EndDate &&
                             o.Customer != null)
                .GroupBy(o => new { o.CustomerId, o.Customer!.Name })
                .Select(g => new TopCustomerDto
                {
                    CustomerId = g.Key.CustomerId,
                    CustomerName = g.Key.Name,
                    TotalOrders = g.Count(),
                    TotalSpent = g.Sum(o => o.TotalAmount - o.DiscountAmount),
                    LastOrderDate = g.Max(o => o.OrderDate)
                })
                .OrderByDescending(c => c.TotalSpent);

            var pagedResult = await PagedList<TopCustomerDto>.CreateAsync(query, request.Page, request.PageSize);

            return ApiResponse<PagedList<TopCustomerDto>>.Success(pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<TopCustomerDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<PromotionReportDto>> GetPromotionReportAsync(PromotionReportRequest request)
    {
        try
        {
            var promotionsQuery = _unitOfWork.Promotions.GetQueryable();

            if (request.PromoId.HasValue)
            {
                promotionsQuery = promotionsQuery.Where(p => p.Id == request.PromoId.Value);
            }

            var promotions = await promotionsQuery.ToListAsync();

            var promotionEffectiveness = new List<PromotionEffectivenessDto>();

            foreach (var promotion in promotions)
            {
                var ordersQuery = _unitOfWork.Orders.GetQueryable()
                    .Where(o => o.PromoId == promotion.Id && o.Status == OrderStatus.Paid);

                if (request.StartDate.HasValue)
                {
                    ordersQuery = ordersQuery.Where(o => o.OrderDate >= request.StartDate.Value);
                }
                if (request.EndDate.HasValue)
                {
                    ordersQuery = ordersQuery.Where(o => o.OrderDate <= request.EndDate.Value);
                }

                var orders = await ordersQuery.ToListAsync();

                var totalRevenue = orders.Sum(o => o.TotalAmount - o.DiscountAmount);
                var totalDiscount = orders.Sum(o => o.DiscountAmount);
                var totalOrders = orders.Count;

                var allOrdersInPeriod = _unitOfWork.Orders.GetQueryable()
                    .Where(o => o.Status == OrderStatus.Paid);

                if (request.StartDate.HasValue)
                {
                    allOrdersInPeriod = allOrdersInPeriod.Where(o => o.OrderDate >= request.StartDate.Value);
                }
                if (request.EndDate.HasValue)
                {
                    allOrdersInPeriod = allOrdersInPeriod.Where(o => o.OrderDate <= request.EndDate.Value);
                }

                var totalOrdersInPeriod = await allOrdersInPeriod.CountAsync();
                var conversionRate = totalOrdersInPeriod > 0 ? (decimal)totalOrders / totalOrdersInPeriod * 100 : 0;

                var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                promotionEffectiveness.Add(new PromotionEffectivenessDto
                {
                    PromoId = promotion.Id,
                    PromoCode = promotion.PromoCode,
                    Description = promotion.Description ?? string.Empty,
                    DiscountType = promotion.DiscountType.ToString(),
                    DiscountValue = promotion.DiscountValue,
                    StartDate = promotion.StartDate,
                    EndDate = promotion.EndDate,
                    Status = promotion.Status,
                    UsedCount = promotion.UsedCount,
                    UsageLimit = promotion.UsageLimit,
                    TotalRevenue = totalRevenue,
                    TotalDiscountAmount = totalDiscount,
                    ConversionRate = conversionRate,
                    TotalOrders = totalOrders,
                    AverageOrderValue = averageOrderValue
                });
            }

            var ordersWithPromotion = new List<OrderWithPromotionDto>();

            if (request.IncludeOrderDetails)
            {
                var ordersQuery = _unitOfWork.Orders.GetQueryable()
                    .Include(o => o.Promotion)
                    .Include(o => o.Customer)
                    .Where(o => o.PromoId != null && o.Status == OrderStatus.Paid);

                if (request.StartDate.HasValue)
                {
                    ordersQuery = ordersQuery.Where(o => o.OrderDate >= request.StartDate.Value);
                }
                if (request.EndDate.HasValue)
                {
                    ordersQuery = ordersQuery.Where(o => o.OrderDate <= request.EndDate.Value);
                }
                if (request.PromoId.HasValue)
                {
                    ordersQuery = ordersQuery.Where(o => o.PromoId == request.PromoId.Value);
                }

                ordersWithPromotion = await ordersQuery
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new OrderWithPromotionDto
                    {
                        OrderId = o.Id,
                        OrderDate = o.OrderDate,
                        OrderStatus = o.Status.ToString(),
                        TotalAmount = o.TotalAmount,
                        DiscountAmount = o.DiscountAmount,
                        FinalAmount = o.TotalAmount - o.DiscountAmount,
                        PromoId = o.PromoId,
                        PromoCode = o.Promotion != null ? o.Promotion.PromoCode : string.Empty,
                        DiscountType = o.Promotion != null ? o.Promotion.DiscountType.ToString() : string.Empty,
                        DiscountValue = o.Promotion != null ? o.Promotion.DiscountValue : 0,
                        CustomerId = o.CustomerId,
                        CustomerName = o.Customer != null ? o.Customer.Name : null
                    })
                    .ToListAsync();
            }

            var activePromotions = promotions.Count(p => p.Status == PromotionStatus.Active);
            var totalOrdersWithPromotion = promotionEffectiveness.Sum(p => p.TotalOrders);
            var totalRevenueFromPromotions = promotionEffectiveness.Sum(p => p.TotalRevenue);
            var totalDiscountGiven = promotionEffectiveness.Sum(p => p.TotalDiscountAmount);

            var averageDiscountRate = totalRevenueFromPromotions > 0
                ? (totalDiscountGiven / totalRevenueFromPromotions) * 100
                : 0;

            var summary = new PromotionReportSummaryDto
            {
                TotalPromotions = promotions.Count,
                ActivePromotions = activePromotions,
                TotalOrdersWithPromotion = totalOrdersWithPromotion,
                TotalRevenueFromPromotions = totalRevenueFromPromotions,
                TotalDiscountGiven = totalDiscountGiven,
                AverageDiscountRate = averageDiscountRate
            };

            var report = new PromotionReportDto
            {
                PromotionEffectiveness = promotionEffectiveness
                    .OrderByDescending(p => p.TotalRevenue)
                    .ToList(),
                OrdersWithPromotion = ordersWithPromotion,
                Summary = summary
            };

            return ApiResponse<PromotionReportDto>.Success(report);
        }
        catch (Exception ex)
        {
            return ApiResponse<PromotionReportDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<InventoryForecastReportDto>> GetInventoryForecastAsync(InventoryForecastRequest request)
    {
        try
        {
            var endDate = DateTime.UtcNow;
            var startDate = endDate.AddMonths(-request.LookbackMonths);

            IQueryable<ProductEntity> productsQuery = _unitOfWork.Products.GetQueryable();

            if (request.ProductId.HasValue)
            {
                productsQuery = productsQuery.Where(p => p.Id == request.ProductId.Value);
            }

            if (request.CategoryId.HasValue)
            {
                productsQuery = productsQuery.Where(p => p.CategoryId == request.CategoryId.Value);
            }

            productsQuery = productsQuery
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .Include(p => p.Inventory);

            var products = await productsQuery.ToListAsync();

            var forecasts = new List<InventoryForecastDto>();

            foreach (var product in products)
            {
                var currentQuantity = product.Inventory?.Quantity ?? 0;

                var soldItems = await _unitOfWork.OrderItems.GetQueryable()
                    .Include(oi => oi.Order)
                    .Where(oi => oi.ProductId == product.Id &&
                                oi.Order.Status == OrderStatus.Paid &&
                                oi.Order.OrderDate >= startDate &&
                                oi.Order.OrderDate <= endDate)
                    .SumAsync(oi => (int?)oi.Quantity) ?? 0;

                var averageMonthlySales = request.LookbackMonths > 0
                    ? (decimal)soldItems / request.LookbackMonths
                    : 0;

                var daysInPeriod = (endDate - startDate).Days;
                var averageDailySales = daysInPeriod > 0
                    ? (decimal)soldItems / daysInPeriod
                    : 0;

                var forecastedDaysRemaining = averageDailySales > 0
                    ? (int)(currentQuantity / averageDailySales)
                    : int.MaxValue;

                var bufferDays = (int)Math.Ceiling(request.LeadTimeDays * (request.SafetyStockMultiplier - 1));
                var daysToCover = request.LeadTimeDays + bufferDays;
                var requiredQuantity = (int)Math.Ceiling(averageDailySales * daysToCover);
                var recommendedOrderQuantity = Math.Max(0, requiredQuantity - currentQuantity);

                var stockStatus = DetermineStockStatus(currentQuantity, averageDailySales, request.LeadTimeDays);
                var needsReorder = recommendedOrderQuantity > 0 || currentQuantity == 0;
                var estimatedCost = recommendedOrderQuantity * product.Price;
                var recommendation = GenerateRecommendation(
                    stockStatus,
                    currentQuantity,
                    recommendedOrderQuantity,
                    forecastedDaysRemaining
                );

                forecasts.Add(new InventoryForecastDto
                {
                    ProductId = product.Id,
                    ProductName = product.ProductName,
                    CategoryName = product.Category.CategoryName,
                    SupplierName = product.Supplier.Name,
                    CurrentQuantity = currentQuantity,
                    AverageMonthlySales = averageMonthlySales,
                    AverageDailySales = averageDailySales,
                    TotalSoldInPeriod = soldItems,
                    MonthsAnalyzed = request.LookbackMonths,
                    ForecastedDaysRemaining = forecastedDaysRemaining,
                    RecommendedOrderQuantity = recommendedOrderQuantity,
                    EstimatedCost = estimatedCost,
                    StockStatus = stockStatus,
                    NeedsReorder = needsReorder,
                    Recommendation = recommendation
                });
            }

            var summary = new InventoryForecastSummaryDto
            {
                TotalProducts = forecasts.Count,
                ProductsNeedingReorder = forecasts.Count(f => f.NeedsReorder),
                LowStockProducts = forecasts.Count(f => f.StockStatus == "low"),
                CriticalStockProducts = forecasts.Count(f => f.StockStatus == "critical"),
                OutOfStockProducts = forecasts.Count(f => f.StockStatus == "out_of_stock"),
                TotalEstimatedCost = forecasts.Sum(f => f.EstimatedCost),
                TotalRecommendedQuantity = forecasts.Sum(f => f.RecommendedOrderQuantity)
            };

            var report = new InventoryForecastReportDto
            {
                Forecasts = forecasts
                    .OrderByDescending(f => f.NeedsReorder)
                    .ThenBy(f => f.ForecastedDaysRemaining)
                    .ToList(),
                Summary = summary
            };

            return ApiResponse<InventoryForecastReportDto>.Success(report);
        }
        catch (Exception ex)
        {
            return ApiResponse<InventoryForecastReportDto>.Error(ex.Message);
        }
    }

    private string DetermineStockStatus(int currentQuantity, decimal averageDailySales, int leadTimeDays)
    {
        if (currentQuantity == 0)
        {
            return "out_of_stock";
        }

        var daysRemaining = averageDailySales > 0 ? (int)(currentQuantity / averageDailySales) : int.MaxValue;

        if (daysRemaining <= leadTimeDays)
        {
            return "critical";
        }

        if (daysRemaining <= leadTimeDays * 2)
        {
            return "low";
        }

        return "sufficient";
    }

    private string GenerateRecommendation(string stockStatus, int currentQuantity, int recommendedQuantity, int daysRemaining)
    {
        return stockStatus switch
        {
            "out_of_stock" => $"Hết hàng. Cần nhập ngay {recommendedQuantity} sản phẩm.",
            "critical" => $"Tồn kho nguy hiểm (còn {daysRemaining} ngày). Cần nhập ngay {recommendedQuantity} sản phẩm.",
            "low" => $"Tồn kho thấp (còn {daysRemaining} ngày). Nên nhập {recommendedQuantity} sản phẩm trong {Math.Max(daysRemaining - 7, 0)} ngày tới.",
            _ => $"Tồn kho đủ dùng (còn {daysRemaining} ngày). Không cần nhập hàng ngay."
        };
    }
}
