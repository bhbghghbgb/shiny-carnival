using System.Text.Json.Serialization;

namespace UnoApp1.Models;

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
