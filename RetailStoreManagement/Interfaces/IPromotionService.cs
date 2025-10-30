using RetailStoreManagement.Common;
using RetailStoreManagement.Models.DTOs.Promotions;

namespace RetailStoreManagement.Interfaces;

public interface IPromotionService
{
    Task<ApiResponse<PromotionResponseDto>> GetByIdAsync(int id);
    Task<ApiResponse<PagedList<PromotionListDto>>> GetPagedAsync(PagedRequest request, string? status = null);
    Task<ApiResponse<PromotionResponseDto>> CreateAsync(CreatePromotionRequest request);
    Task<ApiResponse<PromotionResponseDto>> UpdateAsync(int id, UpdatePromotionRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id);
    Task<ApiResponse<ValidatePromoResponse>> ValidatePromoCodeAsync(ValidatePromoRequest request);
    Task<decimal> CalculateDiscountAsync(string promoCode, decimal orderTotal);
}
