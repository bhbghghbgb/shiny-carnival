namespace RetailStoreManagement.Models.Category;

public class CategoryResponseDto
{
    public int Id { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
}
