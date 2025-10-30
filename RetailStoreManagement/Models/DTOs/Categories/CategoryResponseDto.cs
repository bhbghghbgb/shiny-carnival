namespace RetailStoreManagement.Models.DTOs.Categories;

public class CategoryResponseDto
{
    public int Id { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
}
