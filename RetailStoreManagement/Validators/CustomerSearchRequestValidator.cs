using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho CustomerSearchRequest
/// Kế thừa validation từ BasePaginationValidator và thêm validation cho các filters riêng
/// </summary>
public class CustomerSearchRequestValidator : BasePaginationValidator<CustomerSearchRequest>
{
    public CustomerSearchRequestValidator()
    {
        // Base pagination validation rules được kế thừa từ BasePaginationValidator

        // Validation cho SortBy - chỉ cho phép các property hợp lệ của CustomerEntity
        RuleFor(x => x.SortBy)
            .Must(sortBy => IsValidSortProperty(sortBy))
            .WithMessage("SortBy must be one of: Id, Name, Phone, Email, Address, CreatedAt, UpdatedAt, DeletedAt");
    }

    /// <summary>
    /// Kiểm tra xem property có hợp lệ để sort không
    /// </summary>
    private static bool IsValidSortProperty(string sortBy)
    {
        var validProperties = new[] { "Id", "Name", "Phone", "Email", "Address", "CreatedAt", "UpdatedAt", "DeletedAt" };
        return validProperties.Contains(sortBy, StringComparer.OrdinalIgnoreCase);
    }
}

