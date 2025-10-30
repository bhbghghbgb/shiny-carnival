namespace RetailStoreManagement.Models.DTOs.Customers;

public class CustomerListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateTime? LastOrderDate { get; set; }
}
