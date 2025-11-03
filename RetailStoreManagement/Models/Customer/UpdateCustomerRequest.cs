using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Customer;

public class UpdateCustomerRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }
}
