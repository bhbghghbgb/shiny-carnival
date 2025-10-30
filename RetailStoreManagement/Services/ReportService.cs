using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Enums;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Reports;

namespace RetailStoreManagement.Services;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ReportService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<RevenueReportDto>> GetRevenueReportAsync(RevenueReportRequest request)
    {
        var orders = await _context.Orders
            .Where(o => o.OrderDate >= request.StartDate && 
                       o.OrderDate <= request.EndDate && 
                       o.Status == OrderStatus.Paid &&
                       !o.IsDeleted)
            .ToListAsync();

        var summary = new RevenueSummaryDto
        {
            OverallRevenue = orders.Sum(o => o.TotalAmount - o.DiscountAmount),
            OverallOrders = orders.Count,
            OverallDiscount = orders.Sum(o => o.DiscountAmount),
            AverageOrderValue = orders.Any() ? orders.Average(o => o.TotalAmount - o.DiscountAmount) : 0,
            Period = $"{request.StartDate:yyyy-MM-dd} to {request.EndDate:yyyy-MM-dd}"
        };

        var details = new List<RevenueDetailDto>();

        if (request.GroupBy.ToLower() == "day")
        {
            var grouped = orders.GroupBy(o => o.OrderDate.Date);
            foreach (var group in grouped.OrderBy(g => g.Key))
            {
                details.Add(new RevenueDetailDto
                {
                    Period = group.Key.ToString("yyyy-MM-dd"),
                    TotalRevenue = group.Sum(o => o.TotalAmount - o.DiscountAmount),
                    TotalOrders = group.Count(),
                    TotalDiscount = group.Sum(o => o.DiscountAmount),
                    AverageOrderValue = group.Average(o => o.TotalAmount - o.DiscountAmount),
                    Date = group.Key
                });
            }
        }
        else if (request.GroupBy.ToLower() == "week")
        {
            var grouped = orders.GroupBy(o => GetWeekOfYear(o.OrderDate));
            foreach (var group in grouped.OrderBy(g => g.Key))
            {
                var firstDate = group.Min(o => o.OrderDate);
                details.Add(new RevenueDetailDto
                {
                    Period = $"Week {group.Key}",
                    TotalRevenue = group.Sum(o => o.TotalAmount - o.DiscountAmount),
                    TotalOrders = group.Count(),
                    TotalDiscount = group.Sum(o => o.DiscountAmount),
                    AverageOrderValue = group.Average(o => o.TotalAmount - o.DiscountAmount),
                    Date = firstDate
                });
            }
        }
        else if (request.GroupBy.ToLower() == "month")
        {
            var grouped = orders.GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month });
            foreach (var group in grouped.OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month))
            {
                details.Add(new RevenueDetailDto
                {
                    Period = $"{group.Key.Year}-{group.Key.Month:D2}",
                    TotalRevenue = group.Sum(o => o.TotalAmount - o.DiscountAmount),
                    TotalOrders = group.Count(),
                    TotalDiscount = group.Sum(o => o.DiscountAmount),
                    AverageOrderValue = group.Average(o => o.TotalAmount - o.DiscountAmount),
                    Date = new DateTime(group.Key.Year, group.Key.Month, 1)
                });
            }
        }

        var report = new RevenueReportDto
        {
            Summary = summary,
            Details = details
        };

        return ApiResponse<RevenueReportDto>.Success(report);
    }

    public async Task<ApiResponse<SalesReportDto>> GetSalesReportAsync(SalesReportRequest request)
    {
        var topProducts = await GetTopProductsAsync(request.StartDate, request.EndDate, 10);
        var topCustomers = await GetTopCustomersAsync(request.StartDate, request.EndDate, 10);

        var categoryBreakdown = await _context.OrderItems
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
                .ThenInclude(p => p.Category)
            .Where(oi => oi.Order.OrderDate >= request.StartDate && 
                        oi.Order.OrderDate <= request.EndDate &&
                        oi.Order.Status == OrderStatus.Paid &&
                        !oi.IsDeleted)
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

    public async Task<ApiResponse<List<TopProductDto>>> GetTopProductsAsync(DateTime startDate, DateTime endDate, int limit = 10)
    {
        var topProducts = await _context.OrderItems
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
            .Where(oi => oi.Order.OrderDate >= startDate && 
                        oi.Order.OrderDate <= endDate &&
                        oi.Order.Status == OrderStatus.Paid &&
                        !oi.IsDeleted)
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

    public async Task<ApiResponse<List<TopCustomerDto>>> GetTopCustomersAsync(DateTime startDate, DateTime endDate, int limit = 10)
    {
        var topCustomers = await _context.Orders
            .Include(o => o.Customer)
            .Where(o => o.OrderDate >= startDate && 
                       o.OrderDate <= endDate &&
                       o.Status == OrderStatus.Paid &&
                       !o.IsDeleted)
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

    private static int GetWeekOfYear(DateTime date)
    {
        var day = (int)System.Globalization.CultureInfo.CurrentCulture.Calendar.GetDayOfWeek(date);
        return System.Globalization.CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
            date, System.Globalization.CalendarWeekRule.FirstDay, DayOfWeek.Monday);
    }
}
