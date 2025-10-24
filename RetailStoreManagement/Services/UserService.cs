using System;
using System.Threading.Tasks;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Services;

public class UserService : BaseService<UserEntity, int>
{
    private readonly IUserRepository _repo;

    public UserService(IUserRepository repository) : base(repository)
    {
        _repo = repository;
    }

    public override async Task<ApiResponse<UserEntity>> GetByIdAsync(int id)
    {
        var entity = await _repo.GetByIdAsync(id);
        if (entity == null)
        {
            return ApiResponse<UserEntity>.Fail("User not found");
        }

        // Do not return password
        entity.Password = string.Empty;
        return ApiResponse<UserEntity>.Success(entity);
    }

    public override async Task<ApiResponse<IPagedList<UserEntity>>> GetPagedAsync(PagedRequest request)
    {
        var result = await _repo.GetPagedAsync(request);

        // Clear passwords in items
        foreach (var item in result.Items)
        {
            item.Password = string.Empty;
        }

        return ApiResponse<IPagedList<UserEntity>>.Success(result);
    }

    public override async Task<ApiResponse<UserEntity>> CreateAsync(UserEntity entity)
    {
        // Ensure username uniqueness using IUserRepository helper
        var exists = await _repo.GetByNameAsync(entity.Username);
        if (exists != null)
        {
            return ApiResponse<UserEntity>.Fail("Username already exists");
        }

        var created = await _repo.AddAsync(entity);
        created.Password = string.Empty;
        return ApiResponse<UserEntity>.Success(created, "Created successfully");
    }

    public override async Task<ApiResponse<UserEntity>> UpdateAsync(int id, UserEntity entity)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
        {
            return ApiResponse<UserEntity>.Fail("User not found");
        }

        // Update allowed fields
        existing.FullName = entity.FullName;
        existing.Role = entity.Role;

        await _repo.UpdateAsync(existing);
        existing.Password = string.Empty;
        return ApiResponse<UserEntity>.Success(existing, "Updated successfully");
    }

    public override async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null)
        {
            return ApiResponse<bool>.Fail("User not found");
        }
        await _repo.SoftDeleteAsync(id);
        return ApiResponse<bool>.Success(true, "Deleted successfully");
    }
}