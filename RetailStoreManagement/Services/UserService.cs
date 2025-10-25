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

    public async Task<ApiResponse<UserEntity>> GetByNameAsync(string fullname)
    {
        var user = await _userRepository.GetByNameAsync(fullname);
        if (user == null)
        {
            return ApiResponse<UserEntity>.Fail($"User '{fullname}' not found.");
        }

        return ApiResponse<UserEntity>.Success(user);
    }

    public override async Task<ApiResponse<UserEntity>> UpdateAsync(int id, UserEntity entity)
    {
        var existing = await _userRepository.GetByIdAsync(id);
        if (existing == null)
        {
            return ApiResponse<UserEntity>.Fail("User not found");
        }

        existing.FullName = entity.FullName;
        existing.Password = entity.Password;
        existing.Role = entity.Role;

        await _userRepository.UpdateAsync(existing);
        return ApiResponse<UserEntity>.Success(existing, "Updated successfully");
    }
}