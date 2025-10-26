using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface ICustomerService : IBaseService<CustomerEntity, int>
{
    Task<ApiResponse<CustomerEntity>> GetByNameAsync(string name);
}