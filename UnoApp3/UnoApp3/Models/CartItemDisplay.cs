namespace UnoApp3.Models;

public class CartItemDisplay
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public string ProductName { get; set; } = "";
    public decimal Price { get; set; }
    public decimal Subtotal => Price * Quantity;
    public string PriceFormatted => $"Giá: {Price:N0} đ";
    public string SubtotalFormatted => $"{Subtotal:N0} đ";
}
