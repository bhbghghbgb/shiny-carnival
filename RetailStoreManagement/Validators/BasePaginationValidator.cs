using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Base validator cho tất cả các request có phân trang
/// Chứa các validation rules chung cho Page, PageSize, Search, SortBy, SortDesc
/// </summary>
/// <typeparam name="T">Type của request model kế thừa từ PagedRequest</typeparam>
public abstract class BasePaginationValidator<T> : AbstractValidator<T> where T : PagedRequest
{
    protected BasePaginationValidator()
    {
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

        // Validation cho Search (optional, có thể null hoặc empty)
        RuleFor(x => x.Search)
            .MaximumLength(255)
            .WithMessage("Search term must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Search));
    }
}
