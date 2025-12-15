using FluentValidation;
using RetailStoreManagement.Models.Report;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho TopCustomersSearchRequest
/// Kế thừa từ BasePagedRequestValidator (chỉ validate Page và PageSize)
/// Thêm validation cho date range
///
/// LƯU Ý: TopCustomers endpoint sử dụng FIXED SORTING theo TotalSpent (descending).
/// Request model KHÔNG có SortBy, SortDesc, Search properties.
/// </summary>
public class TopCustomersSearchRequestValidator : BasePagedRequestValidator<TopCustomersSearchRequest>
{
    public TopCustomersSearchRequestValidator()
    {
        // Base validation (Page, PageSize) được kế thừa từ BasePagedRequestValidator

        // Validation cho StartDate
        // Cho phép dates trong tương lai một chút để tránh timezone issues
        RuleFor(x => x.StartDate)
            .LessThanOrEqualTo(DateTime.UtcNow.AddDays(1))
            .WithMessage("StartDate cannot be more than 1 day in the future");

        // Validation cho EndDate
        RuleFor(x => x.EndDate)
            .LessThanOrEqualTo(DateTime.UtcNow.AddDays(1))
            .WithMessage("EndDate cannot be more than 1 day in the future");

        // Validation cho date range
        RuleFor(x => x)
            .Must(x => x.StartDate <= x.EndDate)
            .WithMessage("StartDate must be less than or equal to EndDate");
    }
}

