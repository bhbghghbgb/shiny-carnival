using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Data;

namespace RetailStoreManagement.Repositories;

public class CustomerRepository : Repository<CustomerEntity, int>, ICustomerRepository
{
    public CustomerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CustomerEntity?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Name == name);
    }
}
