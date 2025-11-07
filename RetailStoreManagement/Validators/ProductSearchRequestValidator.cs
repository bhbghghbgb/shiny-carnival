using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho ProductSearchRequest
/// Kế thừa validation từ BasePaginationValidator và thêm validation cho các filters riêng
/// </summary>
public class ProductSearchRequestValidator : BasePaginationValidator<ProductSearchRequest>
{
    public ProductSearchRequestValidator()
    {
        // Base pagination validation rules được kế thừa từ BasePaginationValidator

        // Validation cho CategoryId
        RuleFor(x => x.CategoryId)
            .GreaterThan(0)
            .WithMessage("CategoryId must be greater than 0")
            .When(x => x.CategoryId.HasValue);

        // Validation cho SupplierId
        RuleFor(x => x.SupplierId)
            .GreaterThan(0)
            .WithMessage("SupplierId must be greater than 0")
            .When(x => x.SupplierId.HasValue);

        // Validation cho MinPrice
        RuleFor(x => x.MinPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("MinPrice must be greater than or equal to 0")
            .When(x => x.MinPrice.HasValue);

        // Validation cho MaxPrice
        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("MaxPrice must be greater than or equal to 0")
            .When(x => x.MaxPrice.HasValue);

        // Validation cho price range
        RuleFor(x => x)
            .Must(x => !x.MinPrice.HasValue || !x.MaxPrice.HasValue || 
                      x.MinPrice.Value <= x.MaxPrice.Value)
            .WithMessage("MinPrice must be less than or equal to MaxPrice")
            .When(x => x.MinPrice.HasValue && x.MaxPrice.HasValue);
    }
}
