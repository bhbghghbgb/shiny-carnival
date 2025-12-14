namespace UnoApp4.Models;

public class CartItem
{
    [System.ComponentModel.DataAnnotations.Key]
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
