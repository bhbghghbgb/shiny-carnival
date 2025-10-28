namespace RetailStoreManagement.Models.CustomerModel;

public class CustomerResponse
{
    public int Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string? Phone { get; set; }
    
    public string? Email { get; set; }
    
    public string? Address { get; set; }
}