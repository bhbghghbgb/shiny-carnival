using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Report;
using RetailStoreManagement.Enums;

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

            var details = await query
                .GroupBy(o => new { Period = GetGroupByKey(o.OrderDate, request.GroupBy) })
                .Select(g => new RevenueDetailDto
                {
                    Period = g.Key.Period,
                    TotalRevenue = g.Sum(o => o.TotalAmount - o.DiscountAmount),
                    TotalOrders = g.Count(),
                    TotalDiscount = g.Sum(o => o.DiscountAmount),
                    AverageOrderValue = g.Average(o => o.TotalAmount - o.DiscountAmount),
                    Date = g.Min(o => o.OrderDate)
                })
                .OrderBy(d => d.Date)
                .ToListAsync();

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
            var topProducts = await GetTopProductsAsync(request.StartDate, request.EndDate, 10);
            var topCustomers = await GetTopCustomersAsync(request.StartDate, request.EndDate, 10);

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
                TopProducts = topProducts.Data ?? new List<TopProductDto>(),
                TopCustomers = topCustomers.Data ?? new List<TopCustomerDto>(),
                CategoryBreakdown = categoryBreakdown
            };

            return ApiResponse<SalesReportDto>.Success(report);
        }
        catch (Exception ex)
        {
            return ApiResponse<SalesReportDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<List<TopProductDto>>> GetTopProductsAsync(DateTime startDate, DateTime endDate, int limit = 10)
    {
        try
        {
            var topProducts = await _unitOfWork.OrderItems.GetQueryable()
                .Include(oi => oi.Order)
                .Include(oi => oi.Product)
                .Where(oi => oi.Order.Status == OrderStatus.Paid &&
                             oi.Order.OrderDate >= startDate &&
                             oi.Order.OrderDate <= endDate)
                .GroupBy(oi => new { oi.ProductId, oi.Product.ProductName })
                .Select(g => new TopProductDto
                {
                    ProductId = g.Key.ProductId,
                    ProductName = g.Key.ProductName,
                    TotalQuantitySold = g.Sum(oi => oi.Quantity),
                    TotalRevenue = g.Sum(oi => oi.Subtotal),
                    OrderCount = g.Select(oi => oi.OrderId).Distinct().Count()
                })
                .OrderByDescending(p => p.TotalRevenue)
                .Take(limit)
                .ToListAsync();

            return ApiResponse<List<TopProductDto>>.Success(topProducts);
        }
        catch (Exception ex)
        {
            return ApiResponse<List<TopProductDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<List<TopCustomerDto>>> GetTopCustomersAsync(DateTime startDate, DateTime endDate, int limit = 10)
    {
        try
        {
            var topCustomers = await _unitOfWork.Orders.GetQueryable()
                .Include(o => o.Customer)
                .Where(o => o.Status == OrderStatus.Paid &&
                             o.OrderDate >= startDate &&
                             o.OrderDate <= endDate &&
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
                .OrderByDescending(c => c.TotalSpent)
                .Take(limit)
                .ToListAsync();

            return ApiResponse<List<TopCustomerDto>>.Success(topCustomers);
        }
        catch (Exception ex)
        {
            return ApiResponse<List<TopCustomerDto>>.Error(ex.Message);
        }
    }
}
