namespace RetailStoreManagement.Models.CustomerModel;

public class CustomerRequest
{
    public string Name { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }
}