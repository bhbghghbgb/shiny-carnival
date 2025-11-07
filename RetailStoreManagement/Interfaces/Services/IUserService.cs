using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Models.User;

namespace RetailStoreManagement.Interfaces.Services;

public interface IUserService
{
    Task<ApiResponse<PagedList<UserResponseDto>>> GetUsersAsync(PagedRequest request);
    Task<ApiResponse<UserResponseDto>> GetUserByIdAsync(int id);
    Task<ApiResponse<UserResponseDto>> CreateUserAsync(CreateUserRequest request);
    Task<ApiResponse<UserResponseDto>> UpdateUserAsync(int id, UpdateUserRequest request);
    Task<ApiResponse<UserResponseDto>> SetupAdminAsync(CreateUserRequest request);
    Task<ApiResponse<bool>> DeleteUserAsync(int id);
}
