namespace RetailStoreManagement.Models.DTOs.Orders;

public class OrderDetailsDto : OrderResponseDto
{
    public List<OrderItemDto> OrderItems { get; set; } = new();
    public PaymentDto? PaymentInfo { get; set; }
}
