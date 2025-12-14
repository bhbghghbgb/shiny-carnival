using System.ComponentModel.DataAnnotations;

namespace RetailStoreManagement.Models.Supplier;

public class UpdateSupplierRequest
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(100)]
    public string? Email { get; set; }

    [MaxLength(255)]
    public string? Address { get; set; }
}
