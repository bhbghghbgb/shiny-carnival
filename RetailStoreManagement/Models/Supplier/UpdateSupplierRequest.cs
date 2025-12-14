using System.ComponentModel.DataAnnotations;
using static RetailStoreManagement.Common.ValidationConstants;

namespace RetailStoreManagement.Models.Supplier;

public class UpdateSupplierRequest
{
    [MaxLength(MAX_LENGTH_NAME)]
    public string? Name { get; set; }

    [MaxLength(MAX_LENGTH_PHONE)]
    public string? Phone { get; set; }

    [MaxLength(MAX_LENGTH_EMAIL)]
    public string? Email { get; set; }

    [MaxLength(MAX_LENGTH_ADDRESS)]
    public string? Address { get; set; }
}
