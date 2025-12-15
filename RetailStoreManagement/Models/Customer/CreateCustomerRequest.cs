using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Customer;

public class CreateCustomerRequest
{
    [Required]
    [MaxLength(MAX_LENGTH_NAME)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(MAX_LENGTH_PHONE)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(MAX_LENGTH_EMAIL)]
    public string? Email { get; set; }

    [MaxLength(MAX_LENGTH_ADDRESS)]
    public string? Address { get; set; }
}
