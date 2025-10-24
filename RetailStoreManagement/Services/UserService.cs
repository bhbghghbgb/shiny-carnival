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
    private readonly IRepository<UserEntity, int> _repo;

    public UserService(IRepository<UserEntity, int> repository) : base(repository)
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
        // Ensure username uniqueness
        var exists = await _repo.GetQueryable().AnyAsync(u => u.Username == entity.Username);
        if (exists)
        {
            return ApiResponse<UserEntity>.Fail("Username already exists");
        }

        // Hash password before saving
        entity.Password = HashPassword(entity.Password);

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

        if (!string.IsNullOrWhiteSpace(entity.Password))
        {
            existing.Password = HashPassword(entity.Password);
        }

        await _repo.UpdateAsync(existing);
        existing.Password = string.Empty;
        return ApiResponse<UserEntity>.Success(existing, "Updated successfully");
    }

    public override async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        await _repo.SoftDeleteAsync(id);
        return ApiResponse<bool>.Success(true, "Deleted successfully");
    }

    private static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(32);

        var result = new byte[1 + salt.Length + hash.Length];
        result[0] = 0; // version
        Buffer.BlockCopy(salt, 0, result, 1, salt.Length);
        Buffer.BlockCopy(hash, 0, result, 1 + salt.Length, hash.Length);

        return Convert.ToBase64String(result);
    }

    public static bool VerifyPassword(string stored, string password)
    {
        try
        {
            var bytes = Convert.FromBase64String(stored);
            if (bytes.Length < 1 + 16 + 32) return false;

            var salt = new byte[16];
            Buffer.BlockCopy(bytes, 1, salt, 0, 16);
            var hash = new byte[32];
            Buffer.BlockCopy(bytes, 1 + 16, hash, 0, 32);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100_000, HashAlgorithmName.SHA256);
            var checkHash = pbkdf2.GetBytes(32);

            return CryptographicOperations.FixedTimeEquals(hash, checkHash);
        }
        catch
        {
            return false;
        }
    }
}