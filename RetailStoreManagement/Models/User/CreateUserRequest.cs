using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.User;

public class CreateUserRequest
{
    [Required]
    [MaxLength(MAX_LENGTH_CODE)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(MIN_LENGTH_PASSWORD)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(MAX_LENGTH_NAME)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Range(ROLE_ADMIN, ROLE_STAFF)]
    public int Role { get; set; } // 0: Admin, 1: Staff
}
