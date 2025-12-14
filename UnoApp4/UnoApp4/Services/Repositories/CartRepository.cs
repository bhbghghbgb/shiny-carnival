using Microsoft.EntityFrameworkCore;
using UnoApp4.Services.Interfaces;

namespace UnoApp4.Services.Repositories;

public class CartRepository(AppDbContext context) : ICartRepository
{
    public async Task<List<CartItem>> GetCartItemsAsync()
    {
        return await context.CartItems.ToListAsync();
    }

    public async Task<CartItem> GetCartItemAsync(int productId)
    {
        return await context.CartItems
            .FirstAsync(ci => ci.ProductId == productId);
    }

    public async Task AddToCartAsync(int productId, int quantity)
    {
        var existingItem = await GetCartItemAsync(productId);

        existingItem.Quantity += quantity;
        context.CartItems.Update(existingItem);

        await context.SaveChangesAsync();
    }

    public async Task UpdateCartItemAsync(int productId, int quantity)
    {
        var item = await GetCartItemAsync(productId);
        item.Quantity = quantity;
        context.CartItems.Update(item);
        await context.SaveChangesAsync();
    }

    public async Task RemoveFromCartAsync(int productId)
    {
        var item = await GetCartItemAsync(productId);
        context.CartItems.Remove(item);
        await context.SaveChangesAsync();
    }

    public async Task ClearCartAsync()
    {
        var allItems = await GetCartItemsAsync();
        context.CartItems.RemoveRange(allItems);
        await context.SaveChangesAsync();
    }

    public async Task<int> GetCartCountAsync()
    {
        return await context.CartItems.SumAsync(ci => ci.Quantity);
    }
}
