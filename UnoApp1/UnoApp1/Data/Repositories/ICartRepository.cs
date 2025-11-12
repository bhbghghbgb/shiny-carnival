using ProductApp.Data.Entities;

namespace ProductApp.Data.Repositories;

public interface ICartRepository
{
    Task<List<CartItem>> GetAllAsync();
    Task<CartItem?> GetByProductIdAsync(int productId);
    Task<CartItem> AddOrUpdateAsync(CartItem cartItem);
    Task RemoveAsync(int cartItemId);
    Task RemoveByProductIdAsync(int productId);
    Task ClearAllAsync();
    Task<int> GetTotalCountAsync();
}
