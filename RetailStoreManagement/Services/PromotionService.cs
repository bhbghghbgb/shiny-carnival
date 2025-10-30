using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Enums;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Promotions;

namespace RetailStoreManagement.Services;

public class PromotionService : IPromotionService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public PromotionService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PromotionResponseDto>> GetByIdAsync(int id)
    {
        var promotion = await _context.Promotions.FindAsync(id);
        if (promotion == null || promotion.IsDeleted)
            return ApiResponse<PromotionResponseDto>.Fail("Promotion not found");

        var dto = _mapper.Map<PromotionResponseDto>(promotion);
        return ApiResponse<PromotionResponseDto>.Success(dto);
    }

    public async Task<ApiResponse<PagedList<PromotionListDto>>> GetPagedAsync(PagedRequest request, string? status = null)
    {
        var query = _context.Promotions.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(p => p.PromoCode.Contains(request.Search) || 
                                    p.Description!.Contains(request.Search));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            if (Enum.TryParse<PromotionStatus>(status, true, out var promoStatus))
            {
                query = query.Where(p => p.Status == promoStatus);
            }
        }

        var totalCount = await query.CountAsync();

        query = request.SortDesc 
            ? query.OrderByDescending(p => EF.Property<object>(p, request.SortBy))
            : query.OrderBy(p => EF.Property<object>(p, request.SortBy));

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<PromotionListDto>>(items);
        var pagedList = new PagedList<PromotionListDto>(dtos, totalCount, request.Page, request.PageSize);

        return ApiResponse<PagedList<PromotionListDto>>.Success(pagedList);
    }

    public async Task<ApiResponse<PromotionResponseDto>> CreateAsync(CreatePromotionRequest request)
    {
        if (await PromoCodeExistsAsync(request.PromoCode))
            return ApiResponse<PromotionResponseDto>.Fail("Promo code already exists");

        var promotion = _mapper.Map<PromotionEntity>(request);
        _context.Promotions.Add(promotion);
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<PromotionResponseDto>(promotion);
        return ApiResponse<PromotionResponseDto>.Success(dto, "Promotion created successfully");
    }

    public async Task<ApiResponse<PromotionResponseDto>> UpdateAsync(int id, UpdatePromotionRequest request)
    {
        var promotion = await _context.Promotions.FindAsync(id);
        if (promotion == null || promotion.IsDeleted)
            return ApiResponse<PromotionResponseDto>.Fail("Promotion not found");

        if (await PromoCodeExistsAsync(request.PromoCode, id))
            return ApiResponse<PromotionResponseDto>.Fail("Promo code already exists");

        promotion.PromoCode = request.PromoCode;
        promotion.Description = request.Description;
        promotion.DiscountType = request.DiscountType.ToLower() == "percent" ? DiscountType.Percent : DiscountType.Fixed;
        promotion.DiscountValue = request.DiscountValue;
        promotion.StartDate = DateOnly.FromDateTime(request.StartDate);
        promotion.EndDate = DateOnly.FromDateTime(request.EndDate);
        promotion.MinOrderAmount = request.MinOrderAmount;
        promotion.UsageLimit = request.UsageLimit;
        promotion.Status = request.Status.ToLower() == "active" ? PromotionStatus.Active : PromotionStatus.Inactive;
        promotion.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var dto = _mapper.Map<PromotionResponseDto>(promotion);
        return ApiResponse<PromotionResponseDto>.Success(dto, "Promotion updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var promotion = await _context.Promotions.FindAsync(id);
        if (promotion == null || promotion.IsDeleted)
            return ApiResponse<bool>.Fail("Promotion not found");

        promotion.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Success(true, "Promotion deleted successfully");
    }

    public async Task<ApiResponse<ValidatePromoResponse>> ValidatePromoCodeAsync(ValidatePromoRequest request)
    {
        var promotion = await _context.Promotions
            .FirstOrDefaultAsync(p => p.PromoCode == request.PromoCode && !p.IsDeleted);

        if (promotion == null)
        {
            return ApiResponse<ValidatePromoResponse>.Success(new ValidatePromoResponse
            {
                IsValid = false,
                Message = "Promo code not found"
            });
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        if (promotion.Status != PromotionStatus.Active)
        {
            return ApiResponse<ValidatePromoResponse>.Success(new ValidatePromoResponse
            {
                IsValid = false,
                Message = "Promo code is not active"
            });
        }

        if (today < promotion.StartDate || today > promotion.EndDate)
        {
            return ApiResponse<ValidatePromoResponse>.Success(new ValidatePromoResponse
            {
                IsValid = false,
                Message = "Promo code is not valid for this date"
            });
        }

        if (request.OrderAmount < promotion.MinOrderAmount)
        {
            return ApiResponse<ValidatePromoResponse>.Success(new ValidatePromoResponse
            {
                IsValid = false,
                Message = $"Minimum order amount is {promotion.MinOrderAmount:C}"
            });
        }

        if (promotion.UsageLimit > 0 && promotion.UsedCount >= promotion.UsageLimit)
        {
            return ApiResponse<ValidatePromoResponse>.Success(new ValidatePromoResponse
            {
                IsValid = false,
                Message = "Promo code usage limit reached"
            });
        }

        var discountAmount = await CalculateDiscountAsync(request.PromoCode, request.OrderAmount);

        return ApiResponse<ValidatePromoResponse>.Success(new ValidatePromoResponse
        {
            IsValid = true,
            Message = "Promo code is valid",
            DiscountAmount = discountAmount,
            PromoId = promotion.Id
        });
    }

    public async Task<decimal> CalculateDiscountAsync(string promoCode, decimal orderTotal)
    {
        var promotion = await _context.Promotions
            .FirstOrDefaultAsync(p => p.PromoCode == promoCode && !p.IsDeleted);

        if (promotion == null)
            return 0;

        if (promotion.DiscountType == DiscountType.Percent)
        {
            return orderTotal * (promotion.DiscountValue / 100);
        }
        else
        {
            return Math.Min(promotion.DiscountValue, orderTotal);
        }
    }

    private async Task<bool> PromoCodeExistsAsync(string promoCode, int? excludeId = null)
    {
        return await _context.Promotions
            .AnyAsync(p => p.PromoCode == promoCode && (!excludeId.HasValue || p.Id != excludeId.Value));
    }
}
