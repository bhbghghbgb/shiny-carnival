using FluentValidation;
using RetailStoreManagement.Models.Common;

namespace RetailStoreManagement.Validators;

/// <summary>
/// Validator cho UserSearchRequest
/// Kế thừa validation từ BasePaginationValidator và thêm validation cho các filters riêng
/// </summary>
public class UserSearchRequestValidator : BasePaginationValidator<UserSearchRequest>
{
    public UserSearchRequestValidator()
    {
        // Base pagination validation rules được kế thừa từ BasePaginationValidator

        // Validation cho SortBy - chỉ cho phép các property hợp lệ của UserEntity
        RuleFor(x => x.SortBy)
            .Must(sortBy => IsValidSortProperty(sortBy))
            .WithMessage("SortBy must be one of: Id, Username, FullName, Role, CreatedAt, UpdatedAt, DeletedAt");

        // Validation cho Role filter
        RuleFor(x => x.Role)
            .Must(role => role == 0 || role == 1)
            .When(x => x.Role.HasValue)
            .WithMessage("Role must be 0 (Admin) or 1 (Staff)");
    }

    /// <summary>
    /// Kiểm tra xem property có hợp lệ để sort không
    /// </summary>
    private static bool IsValidSortProperty(string sortBy)
    {
        var validProperties = new[] { "Id", "Username", "FullName", "Role", "CreatedAt", "UpdatedAt", "DeletedAt" };
        return validProperties.Contains(sortBy, StringComparer.OrdinalIgnoreCase);
    }
}

