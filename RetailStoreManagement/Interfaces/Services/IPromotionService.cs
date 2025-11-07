using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Models.Promotion;

namespace RetailStoreManagement.Interfaces.Services;

public interface IPromotionService
{
    Task<ApiResponse<PagedList<PromotionListDto>>> GetPromotionsAsync(PagedRequest request);
    Task<ApiResponse<PromotionResponseDto>> GetPromotionByIdAsync(int id);
    Task<ApiResponse<PromotionResponseDto>> CreatePromotionAsync(CreatePromotionRequest request);
    Task<ApiResponse<PromotionResponseDto>> UpdatePromotionAsync(int id, UpdatePromotionRequest request);
    Task<ApiResponse<bool>> DeletePromotionAsync(int id);
    Task<ApiResponse<ValidatePromoResponse>> ValidatePromotionAsync(ValidatePromoRequest request);
}
