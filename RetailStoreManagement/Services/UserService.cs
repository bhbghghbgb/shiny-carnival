using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Services;

public class UserService : BaseService<UserEntity, int>, IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository) : base(userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<ApiResponse<UserEntity>> GetByNameAsync(string username)
    {
        var user = await _userRepository.GetByNameAsync(username);
        if (user == null)
        {
            return ApiResponse<UserEntity>.Fail($"User '{username}' not found.");
        }

        return ApiResponse<UserEntity>.Success(user);
    }
}