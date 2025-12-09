using Microsoft.EntityFrameworkCore;
using UnoApp3.Data;
using UnoApp3.Data.Entities;
using UnoApp3.Services.Interfaces;

namespace UnoApp3.Services.Repositories;

public class CartRepository : ICartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CartItem>> GetCartItemsAsync()
    {
        return await _context.CartItems.ToListAsync();
    }

    public async Task<CartItem> GetCartItemAsync(int productId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.ProductId == productId);
    }

    public async Task AddToCartAsync(int productId, int quantity)
    {
        var existingItem = await GetCartItemAsync(productId);
        
        if (existingItem != null)
        {
            existingItem.Quantity += quantity;
            _context.CartItems.Update(existingItem);
        }
        else
        {
            var cartItem = new CartItem
            {
                ProductId = productId,
                Quantity = quantity
            };
            await _context.CartItems.AddAsync(cartItem);
        }
        
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCartItemAsync(int productId, int quantity)
    {
        var item = await GetCartItemAsync(productId);
        if (item != null)
        {
            item.Quantity = quantity;
            _context.CartItems.Update(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveFromCartAsync(int productId)
    {
        var item = await GetCartItemAsync(productId);
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearCartAsync()
    {
        var allItems = await GetCartItemsAsync();
        _context.CartItems.RemoveRange(allItems);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetCartCountAsync()
    {
        return await _context.CartItems.SumAsync(ci => ci.Quantity);
    }
}
