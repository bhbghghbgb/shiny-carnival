using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.User;

public class UpdateUserRequest
{
    [MaxLength(MAX_LENGTH_CODE)]
    public string? Username { get; set; }

    [MaxLength(255)]
    public string? Password { get; set; } // Nullable - empty string means no password change

    [MaxLength(MAX_LENGTH_NAME)]
    public string? FullName { get; set; }

    [Range(ROLE_ADMIN, ROLE_STAFF)]
    public int? Role { get; set; } // 0: Admin, 1: Staff
}
