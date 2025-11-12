/// ProductApp/Models/ProductDto.cs
using System.Text.Json.Serialization;

namespace ProductApp.Models;

public class ProductDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("category")]
    public string Category { get; set; } = string.Empty;
}

/// ProductApp/Models/LoginRequestDto.cs
using System.Text.Json.Serialization;

namespace ProductApp.Models;

public class LoginRequestDto
{
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}

/// ProductApp/Models/OrderRequestDto.cs
using System.Text.Json.Serialization;

namespace ProductApp.Models;

public class OrderRequestDto
{
    [JsonPropertyName("items")]
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    [JsonPropertyName("productId")]
    public int ProductId { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }
}
