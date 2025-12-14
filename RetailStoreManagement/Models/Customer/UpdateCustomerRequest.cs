using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Customer;

public class UpdateCustomerRequest
{
    [MaxLength(MAX_LENGTH_NAME)]
    public string? Name { get; set; }

    [MaxLength(MAX_LENGTH_PHONE)]
    public string? Phone { get; set; }

    [EmailAddress]
    [MaxLength(MAX_LENGTH_EMAIL)]
    public string? Email { get; set; }

    [MaxLength(MAX_LENGTH_ADDRESS)]
    public string? Address { get; set; }
}
