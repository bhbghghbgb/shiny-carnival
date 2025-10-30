using RetailStoreManagement.Common;
using RetailStoreManagement.Models.DTOs.Users;

namespace RetailStoreManagement.Interfaces;

public interface IUserService
{
    Task<ApiResponse<UserResponseDto>> GetByIdAsync(int id);
    Task<ApiResponse<PagedList<UserResponseDto>>> GetPagedAsync(PagedRequest request);
    Task<ApiResponse<UserResponseDto>> CreateAsync(CreateUserRequest request);
    Task<ApiResponse<UserResponseDto>> UpdateAsync(int id, UpdateUserRequest request);
    Task<ApiResponse<bool>> DeleteAsync(int id);
    Task<bool> UsernameExistsAsync(string username, int? excludeId = null);
}
