using FluentValidation;
using RetailStoreManagement.Models.Report;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho TopProductsSearchRequest
/// Kế thừa từ BasePagedRequestValidator (chỉ validate Page và PageSize)
/// Thêm validation cho date range
///
/// LƯU Ý: TopProducts endpoint sử dụng FIXED SORTING theo TotalRevenue (descending).
/// Request model KHÔNG có SortBy, SortDesc, Search properties.
/// </summary>
public class TopProductsSearchRequestValidator : BasePagedRequestValidator<TopProductsSearchRequest>
{
    public TopProductsSearchRequestValidator()
    {
        // Base validation (Page, PageSize) được kế thừa từ BasePagedRequestValidator

        // Validation cho StartDate
        RuleFor(x => x.StartDate)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("StartDate cannot be in the future");

        // Validation cho EndDate
        RuleFor(x => x.EndDate)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("EndDate cannot be in the future");

        // Validation cho date range
        RuleFor(x => x)
            .Must(x => x.StartDate <= x.EndDate)
            .WithMessage("StartDate must be less than or equal to EndDate");
    }
}

