using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho InventorySearchRequest
/// Kế thừa validation từ BasePaginationValidator và thêm validation cho các filters riêng
/// </summary>
public class InventorySearchRequestValidator : BasePaginationValidator<InventorySearchRequest>
{
    public InventorySearchRequestValidator()
    {
        // Base pagination validation rules được kế thừa từ BasePaginationValidator

        // Validation cho SortBy - chỉ cho phép các property hợp lệ của InventoryEntity
        RuleFor(x => x.SortBy)
            .Must(sortBy => IsValidSortProperty(sortBy))
            .WithMessage("SortBy must be one of: Id, ProductId, Quantity, CreatedAt, UpdatedAt, DeletedAt");

        // Validation cho ProductId
        RuleFor(x => x.ProductId)
            .GreaterThan(0)
            .When(x => x.ProductId.HasValue)
            .WithMessage("ProductId must be greater than 0");

        // Validation cho MinQuantity
        RuleFor(x => x.MinQuantity)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MinQuantity.HasValue)
            .WithMessage("MinQuantity must be greater than or equal to 0");

        // Validation cho MaxQuantity
        RuleFor(x => x.MaxQuantity)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MaxQuantity.HasValue)
            .WithMessage("MaxQuantity must be greater than or equal to 0");

        // Validation cho quantity range
        RuleFor(x => x)
            .Must(x => !x.MinQuantity.HasValue || !x.MaxQuantity.HasValue ||
                      x.MinQuantity.Value <= x.MaxQuantity.Value)
            .WithMessage("MinQuantity must be less than or equal to MaxQuantity")
            .When(x => x.MinQuantity.HasValue && x.MaxQuantity.HasValue);
    }

    /// <summary>
    /// Kiểm tra xem property có hợp lệ để sort không
    /// </summary>
    private static bool IsValidSortProperty(string sortBy)
    {
        var validProperties = new[] { "Id", "ProductId", "Quantity", "CreatedAt", "UpdatedAt", "DeletedAt" };
        return validProperties.Contains(sortBy, StringComparer.OrdinalIgnoreCase);
    }
}

