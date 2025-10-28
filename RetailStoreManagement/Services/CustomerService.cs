using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Common;

namespace RetailStoreManagement.Services;

public class CustomerService : BaseService<CustomerEntity, int>, ICustomerService
{
    private readonly ICustomerRepository _customerRepository;

    public CustomerService(ICustomerRepository customerRepository) : base(customerRepository)
    {
        _customerRepository = customerRepository;
    }
    // Add customer-specific service logic here if needed
    public async Task<ApiResponse<CustomerEntity>> GetByNameAsync(string name)
    {
        var entity = await _customerRepository.GetByNameAsync(name);
        if (entity == null)
        {
            return ApiResponse<CustomerEntity>.Fail("Customer not found");
        }
        return ApiResponse<CustomerEntity>.Success(entity);
    }
}