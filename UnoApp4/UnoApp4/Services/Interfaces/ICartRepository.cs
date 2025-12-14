namespace UnoApp4.Services.Interfaces;

public interface ICartRepository
{
    Task<List<CartItem>> GetCartItemsAsync();
    Task<CartItem> GetCartItemAsync(int productId);
    Task AddToCartAsync(int productId, int quantity);
    Task UpdateCartItemAsync(int productId, int quantity);
    Task RemoveFromCartAsync(int productId);
    Task ClearCartAsync();
    Task<int> GetCartCountAsync();
}
