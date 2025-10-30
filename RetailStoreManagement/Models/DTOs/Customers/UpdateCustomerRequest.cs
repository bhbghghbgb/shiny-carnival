using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.DTOs.Customers;

public class UpdateCustomerRequest
{
    [Required]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Phone]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(100)]
    [EmailAddress]
    public string? Email { get; set; }

    [MaxLength(1024)]
    public string? Address { get; set; }
}
