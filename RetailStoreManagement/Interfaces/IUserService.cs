using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface IUserService : IBaseService<UserEntity, int>
{
    Task<ApiResponse<UserEntity>> GetByNameAsync(string username);
    // Add more user-specific methods if needed
}