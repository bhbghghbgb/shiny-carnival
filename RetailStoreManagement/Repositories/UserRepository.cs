using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Repositories;

public class UserRepository : Repository<UserEntity, int>
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Override to query by Id using IQueryable (ensures includes / filters apply consistently)
    public override async Task<UserEntity> GetByIdAsync(int id)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Id == id);
    }
}