using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Base validator cho tất cả các request có phân trang đầy đủ
/// Kế thừa từ BasePagedRequestValidator và thêm validation cho Search, SortBy, SortDesc
/// Sử dụng cho các request kế thừa từ PagedRequest
/// </summary>
/// <typeparam name="T">Type của request model kế thừa từ PagedRequest</typeparam>
public abstract class BasePaginationValidator<T> : BasePagedRequestValidator<T> where T : PagedRequest
{
    protected BasePaginationValidator()
    {
        // Base validation (Page, PageSize) được kế thừa từ BasePagedRequestValidator

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
