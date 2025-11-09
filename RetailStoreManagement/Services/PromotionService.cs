using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Promotion;
using RetailStoreManagement.Enums;

namespace RetailStoreManagement.Services;

public class PromotionService : IPromotionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public PromotionService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<PromotionListDto>>> GetPromotionsAsync(PromotionSearchRequest request)
    {
        try
        {
            var query = _unitOfWork.Promotions.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(p => p.PromoCode.Contains(request.Search) || 
                                        (p.Description != null && p.Description.Contains(request.Search)));
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(p => EF.Property<object>(p, request.SortBy))
                : query.OrderBy(p => EF.Property<object>(p, request.SortBy));

            // Project to DTO and keep IQueryable
            var dtoQuery = query.Select(p => new PromotionListDto
            {
                Id = p.Id,
                PromoCode = p.PromoCode,
                Description = p.Description,
                DiscountType = p.DiscountType.ToString().ToLower(),
                DiscountValue = p.DiscountValue,
                StartDate = p.StartDate.ToDateTime(TimeOnly.MinValue),
                EndDate = p.EndDate.ToDateTime(TimeOnly.MaxValue),
                Status = p.Status.ToString().ToLower(),
                UsedCount = p.UsedCount,
                RemainingUsage = p.UsageLimit - p.UsedCount
            });

            // Use PagedList.CreateAsync for database-level pagination
            var pagedList = await PagedList<PromotionListDto>.CreateAsync(dtoQuery, request.Page, request.PageSize);

            return ApiResponse<PagedList<PromotionListDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<PromotionListDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<PromotionResponseDto>> GetPromotionByIdAsync(int id)
    {
        try
        {
            var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);
            if (promotion == null)
            {
                return ApiResponse<PromotionResponseDto>.Error("Promotion not found", 404);
            }

            var promotionDto = _mapper.Map<PromotionResponseDto>(promotion);
            return ApiResponse<PromotionResponseDto>.Success(promotionDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<PromotionResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<PromotionResponseDto>> CreatePromotionAsync(CreatePromotionRequest request)
    {
        try
        {
            // Check if promo code already exists
            var existingPromotion = await _unitOfWork.Promotions.GetQueryable()
                .FirstOrDefaultAsync(p => p.PromoCode == request.PromoCode);
            
            if (existingPromotion != null)
            {
                return ApiResponse<PromotionResponseDto>.Error("Promo code already exists", 409);
            }

            // Validate dates
            if (request.StartDate >= request.EndDate)
            {
                return ApiResponse<PromotionResponseDto>.Error("Start date must be before end date", 400);
            }

            var promotion = _mapper.Map<PromotionEntity>(request);

            await _unitOfWork.Promotions.AddAsync(promotion);
            await _unitOfWork.SaveChangesAsync();

            var promotionDto = _mapper.Map<PromotionResponseDto>(promotion);
            return ApiResponse<PromotionResponseDto>.Success(promotionDto, "Promotion created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<PromotionResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<PromotionResponseDto>> UpdatePromotionAsync(int id, UpdatePromotionRequest request)
    {
        try
        {
            var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);
            if (promotion == null)
            {
                return ApiResponse<PromotionResponseDto>.Error("Promotion not found", 404);
            }

            // Check if promo code already exists (excluding current promotion)
            var existingPromotion = await _unitOfWork.Promotions.GetQueryable()
                .FirstOrDefaultAsync(p => p.PromoCode == request.PromoCode && p.Id != id);
            
            if (existingPromotion != null)
            {
                return ApiResponse<PromotionResponseDto>.Error("Promo code already exists", 409);
            }

            // Validate dates
            if (request.StartDate >= request.EndDate)
            {
                return ApiResponse<PromotionResponseDto>.Error("Start date must be before end date", 400);
            }

            _mapper.Map(request, promotion);

            await _unitOfWork.Promotions.UpdateAsync(promotion);
            await _unitOfWork.SaveChangesAsync();

            var promotionDto = _mapper.Map<PromotionResponseDto>(promotion);
            return ApiResponse<PromotionResponseDto>.Success(promotionDto, "Promotion updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<PromotionResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<bool>> DeletePromotionAsync(int id)
    {
        try
        {
            var promotion = await _unitOfWork.Promotions.GetQueryable()
                .Include(p => p.Orders)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (promotion == null)
            {
                return ApiResponse<bool>.Error("Promotion not found", 404);
            }

            // Check if promotion is in use
            if (promotion.Orders.Any())
            {
                return ApiResponse<bool>.Error("Cannot delete promotion that is in use", 409);
            }

            await _unitOfWork.Promotions.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "Promotion deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<ValidatePromoResponse>> ValidatePromotionAsync(ValidatePromoRequest request)
    {
        try
        {
            var promotion = await _unitOfWork.Promotions.GetQueryable()
                .FirstOrDefaultAsync(p => p.PromoCode == request.PromoCode);

            if (promotion == null)
            {
                return ApiResponse<ValidatePromoResponse>.Success(new ValidatePromoResponse
                {
                    IsValid = false,
                    Message = "Promotion code not found",
                    DiscountAmount = 0
                });
            }

            var validationResult = ValidatePromotion(promotion, request.OrderAmount);
            var discountAmount = validationResult.isValid ? CalculateDiscount(promotion, request.OrderAmount) : 0;

            var response = new ValidatePromoResponse
            {
                IsValid = validationResult.isValid,
                Message = validationResult.message,
                DiscountAmount = discountAmount,
                PromoId = validationResult.isValid ? promotion.Id : null
            };

            return ApiResponse<ValidatePromoResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return ApiResponse<ValidatePromoResponse>.Error(ex.Message);
        }
    }

    private (bool isValid, string message) ValidatePromotion(PromotionEntity promotion, decimal orderTotal)
    {
        if (promotion.Status != PromotionStatus.Active)
            return (false, "Promotion is not active");

        var now = DateTime.UtcNow;
        var startDate = promotion.StartDate.ToDateTime(TimeOnly.MinValue);
        var endDate = promotion.EndDate.ToDateTime(TimeOnly.MaxValue);

        if (now < startDate || now > endDate)
            return (false, "Promotion is not valid for current date");

        if (orderTotal < promotion.MinOrderAmount)
            return (false, $"Order amount must be at least {promotion.MinOrderAmount:C}");

        if (promotion.UsedCount >= promotion.UsageLimit)
            return (false, "Promotion usage limit exceeded");

        return (true, "Valid promotion");
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
}
