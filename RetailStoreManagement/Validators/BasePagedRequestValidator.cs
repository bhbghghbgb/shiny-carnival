using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Base validator cho tất cả các request có phân trang cơ bản
/// Chứa validation rules cho Page và PageSize
/// Sử dụng cho các request kế thừa từ BasePagedRequest
/// </summary>
/// <typeparam name="T">Type của request model kế thừa từ BasePagedRequest</typeparam>
public abstract class BasePagedRequestValidator<T> : AbstractValidator<T> where T : BasePagedRequest
{
    protected BasePagedRequestValidator()
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
    }
}

