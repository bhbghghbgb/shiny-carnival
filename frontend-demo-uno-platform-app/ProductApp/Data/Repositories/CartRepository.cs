using Microsoft.EntityFrameworkCore;
using ProductApp.Data.Entities;

namespace ProductApp.Data.Repositories;

public class CartRepository : ICartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CartItem>> GetAllAsync()
    {
        return await _context.CartItems
            .OrderByDescending(x => x.AddedAt)
            .ToListAsync();
    }

    public async Task<CartItem?> GetByProductIdAsync(int productId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(x => x.ProductId == productId);
    }

    public async Task<CartItem> AddOrUpdateAsync(CartItem cartItem)
    {
        var existingItem = await GetByProductIdAsync(cartItem.ProductId);
        
        if (existingItem != null)
        {
            existingItem.Quantity += cartItem.Quantity;
            _context.CartItems.Update(existingItem);
            await _context.SaveChangesAsync();
            return existingItem;
        }
        else
        {
            cartItem.AddedAt = DateTime.UtcNow;
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();
            return cartItem;
        }
    }

    public async Task RemoveAsync(int cartItemId)
    {
        var item = await _context.CartItems.FindAsync(cartItemId);
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveByProductIdAsync(int productId)
    {
        var item = await GetByProductIdAsync(productId);
        if (item != null)
        {
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearAllAsync()
    {
        _context.CartItems.RemoveRange(_context.CartItems);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.CartItems.SumAsync(x => x.Quantity);
    }
}
