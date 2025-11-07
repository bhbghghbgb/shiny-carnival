using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho CategorySearchRequest
/// Kế thừa validation từ PagedRequestValidator và thêm validation cho các filters riêng
/// </summary>
public class CategorySearchRequestValidator : AbstractValidator<CategorySearchRequest>
{
    public CategorySearchRequestValidator()
    {
        // Kế thừa validation từ PagedRequestValidator
        // Validation cho Page
        RuleFor(x => x.Page)
            .GreaterThan(0)
            .WithMessage("Page must be greater than 0");

        // Validation cho PageSize
        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .WithMessage("PageSize must be greater than 0")
            .LessThanOrEqualTo(100)
            .WithMessage("PageSize must not exceed 100");

        // Validation cho SortBy
        RuleFor(x => x.SortBy)
            .NotEmpty()
            .WithMessage("SortBy must not be empty");

        // Validation cho MinProductCount
        RuleFor(x => x.MinProductCount)
            .GreaterThanOrEqualTo(0)
            .WithMessage("MinProductCount must be greater than or equal to 0")
            .When(x => x.MinProductCount.HasValue);

        // Validation cho MaxProductCount
        RuleFor(x => x.MaxProductCount)
            .GreaterThanOrEqualTo(0)
            .WithMessage("MaxProductCount must be greater than or equal to 0")
            .When(x => x.MaxProductCount.HasValue);

        // Validation cho range ProductCount
        RuleFor(x => x)
            .Must(x => !x.MinProductCount.HasValue || !x.MaxProductCount.HasValue || 
                      x.MinProductCount.Value <= x.MaxProductCount.Value)
            .WithMessage("MinProductCount must be less than or equal to MaxProductCount")
            .When(x => x.MinProductCount.HasValue && x.MaxProductCount.HasValue);

        // Validation cho CreatedAfter
        RuleFor(x => x.CreatedAfter)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("CreatedAfter cannot be in the future")
            .When(x => x.CreatedAfter.HasValue);

        // Validation cho CreatedBefore
        RuleFor(x => x.CreatedBefore)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("CreatedBefore cannot be in the future")
            .When(x => x.CreatedBefore.HasValue);

        // Validation cho date range
        RuleFor(x => x)
            .Must(x => !x.CreatedAfter.HasValue || !x.CreatedBefore.HasValue || 
                      x.CreatedAfter.Value <= x.CreatedBefore.Value)
            .WithMessage("CreatedAfter must be less than or equal to CreatedBefore")
            .When(x => x.CreatedAfter.HasValue && x.CreatedBefore.HasValue);
    }
}
