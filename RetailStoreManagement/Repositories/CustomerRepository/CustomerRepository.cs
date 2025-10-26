using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Data;

namespace RetailStoreManagement.Repositories.CustomerRepository;

public class CustomerRepository : Repository<CustomerEntity, int>, ICustomerRepository
{
    public CustomerRepository(ApplicationDbContext context) : base(context)
    {
    }

    protected override IQueryable<CustomerEntity> ApplySearch(IQueryable<CustomerEntity> query, string search)
    {
        if (string.IsNullOrWhiteSpace(search)) return query;
        return query.Where(c => c.Name.Contains(search) || (c.Phone != null && c.Phone.Contains(search)) || (c.Email != null && c.Email.Contains(search)));
    }

    public async Task<CustomerEntity?> GetByNameAsync(string name)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.Name == name);
    }
}
