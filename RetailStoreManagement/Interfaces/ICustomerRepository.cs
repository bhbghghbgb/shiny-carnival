using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface ICustomerRepository : IRepository<CustomerEntity, int>
{
    Task<CustomerEntity?> GetByNameAsync(string name);
}