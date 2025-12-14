using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Customer;

public class UpdateCustomerRequest
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    [EmailAddress]
    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }
}
