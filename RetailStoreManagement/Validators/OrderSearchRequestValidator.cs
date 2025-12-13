using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho OrderSearchRequest
/// Kế thừa validation từ BasePaginationValidator và thêm validation cho các filters riêng
/// </summary>
public class OrderSearchRequestValidator : BasePaginationValidator<OrderSearchRequest>
{
    public OrderSearchRequestValidator()
    {
        // Base pagination validation rules được kế thừa từ BasePaginationValidator

        // Validation cho SortBy - chỉ cho phép các property hợp lệ của OrderEntity
        RuleFor(x => x.SortBy)
            .Must(sortBy => IsValidSortProperty(sortBy))
            .WithMessage("SortBy must be one of: Id, CustomerId, UserId, PromoId, OrderDate, Status, TotalAmount, DiscountAmount, CreatedAt, UpdatedAt, DeletedAt");

        // Validation cho CustomerId
        RuleFor(x => x.CustomerId)
            .GreaterThan(0)
            .WithMessage("CustomerId must be greater than 0")
            .When(x => x.CustomerId.HasValue);

        // Validation cho UserId
        RuleFor(x => x.UserId)
            .GreaterThan(0)
            .WithMessage("UserId must be greater than 0")
            .When(x => x.UserId.HasValue);

        // Validation cho StartDate - cho phép date trong tương lai (có thể có pre-orders)
        // Không validate "cannot be in the future" vì có thể có use case hợp lệ

        // Validation cho EndDate - cho phép date trong tương lai
        // Không validate "cannot be in the future" vì có thể có use case hợp lệ

        // Validation cho date range
        RuleFor(x => x)
            .Must(x => !x.StartDate.HasValue || !x.EndDate.HasValue || 
                      x.StartDate.Value <= x.EndDate.Value)
            .WithMessage("StartDate must be less than or equal to EndDate")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        // Validation cho Status
        RuleFor(x => x.Status)
            .Must(status => string.IsNullOrEmpty(status) || IsValidStatus(status))
            .WithMessage("Status must be one of: Pending, Paid, Cancelled")
            .When(x => !string.IsNullOrEmpty(x.Status));
    }

    /// <summary>
    /// Kiểm tra xem property có hợp lệ để sort không
    /// </summary>
    private static bool IsValidSortProperty(string sortBy)
    {
        var validProperties = new[] { "Id", "CustomerId", "UserId", "PromoId", "OrderDate", "Status", "TotalAmount", "DiscountAmount", "CreatedAt", "UpdatedAt", "DeletedAt" };
        return validProperties.Contains(sortBy, StringComparer.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Kiểm tra xem status có hợp lệ không
    /// </summary>
    private static bool IsValidStatus(string status)
    {
        var validStatuses = new[] { "Pending", "Paid", "Cancelled" };
        return validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase);
    }
}

