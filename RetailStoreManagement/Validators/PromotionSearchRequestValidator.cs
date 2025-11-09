using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho PromotionSearchRequest
/// Kế thừa validation từ BasePaginationValidator và thêm validation cho các filters riêng
/// </summary>
public class PromotionSearchRequestValidator : BasePaginationValidator<PromotionSearchRequest>
{
    public PromotionSearchRequestValidator()
    {
        // Base pagination validation rules được kế thừa từ BasePaginationValidator

        // Validation cho SortBy - chỉ cho phép các property hợp lệ của PromotionEntity
        RuleFor(x => x.SortBy)
            .Must(sortBy => IsValidSortProperty(sortBy))
            .WithMessage("SortBy must be one of: Id, PromoCode, Description, DiscountType, DiscountValue, StartDate, EndDate, MinOrderAmount, UsageLimit, UsedCount, Status, CreatedAt, UpdatedAt, DeletedAt");
    }

    /// <summary>
    /// Kiểm tra xem property có hợp lệ để sort không
    /// </summary>
    private static bool IsValidSortProperty(string sortBy)
    {
        var validProperties = new[] { "Id", "PromoCode", "Description", "DiscountType", "DiscountValue", "StartDate", "EndDate", "MinOrderAmount", "UsageLimit", "UsedCount", "Status", "CreatedAt", "UpdatedAt", "DeletedAt" };
        return validProperties.Contains(sortBy, StringComparer.OrdinalIgnoreCase);
    }
}

