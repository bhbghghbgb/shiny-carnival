using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Repositories;

public class UserRepository : Repository<UserEntity, int>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Query by username using _dbSet directly (no GetQueryable)
    public async Task<UserEntity?> GetByNameAsync(string fullname)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.FullName == fullname);
    }
}