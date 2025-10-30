namespace RetailStoreManagement.Models.DTOs.Suppliers;

public class SupplierResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Address { get; set; }
    public int ProductCount { get; set; }
}
