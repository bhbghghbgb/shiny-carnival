using RetailStoreManagement.Entities;

namespace RetailStoreManagement.Interfaces;

public interface IUserRepository : IRepository<UserEntity, int>
{
    Task<UserEntity?> GetByNameAsync(string username);
}