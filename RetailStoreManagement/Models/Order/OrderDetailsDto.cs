namespace RetailStoreManagement.Models.Order;

public class OrderDetailsDto : OrderResponseDto
{
    public List<OrderItemDto> OrderItems { get; set; } = new();
    public PaymentDto? PaymentInfo { get; set; }
}
