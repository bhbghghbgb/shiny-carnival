using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Customer;

namespace RetailStoreManagement.Interfaces.Services;

public interface ICustomerService
{
    Task<ApiResponse<PagedList<CustomerListDto>>> GetCustomersAsync(PagedRequest request);
    Task<ApiResponse<CustomerResponseDto>> GetCustomerByIdAsync(int id);
    Task<ApiResponse<CustomerResponseDto>> CreateCustomerAsync(CreateCustomerRequest request);
    Task<ApiResponse<CustomerResponseDto>> UpdateCustomerAsync(int id, UpdateCustomerRequest request);
    Task<ApiResponse<bool>> DeleteCustomerAsync(int id);
}
