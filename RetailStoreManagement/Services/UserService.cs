using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Data;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Enums;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Users;

namespace RetailStoreManagement.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UserService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<ApiResponse<UserResponseDto>> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null || user.IsDeleted)
            return ApiResponse<UserResponseDto>.Fail("User not found");

        var dto = _mapper.Map<UserResponseDto>(user);
        return ApiResponse<UserResponseDto>.Success(dto);
    }

    public async Task<ApiResponse<PagedList<UserResponseDto>>> GetPagedAsync(PagedRequest request)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            query = query.Where(u => u.Username.Contains(request.Search) || 
                                    u.FullName!.Contains(request.Search));
        }

        var totalCount = await query.CountAsync();

        query = request.SortDesc 
            ? query.OrderByDescending(u => EF.Property<object>(u, request.SortBy))
            : query.OrderBy(u => EF.Property<object>(u, request.SortBy));

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<List<UserResponseDto>>(items);
        var pagedList = new PagedList<UserResponseDto>(dtos, totalCount, request.Page, request.PageSize);

        return ApiResponse<PagedList<UserResponseDto>>.Success(pagedList);
    }

    public async Task<ApiResponse<UserResponseDto>> CreateAsync(CreateUserRequest request)
    {
        if (await UsernameExistsAsync(request.Username))
            return ApiResponse<UserResponseDto>.Fail("Username already exists");

        var user = _mapper.Map<UserEntity>(request);
        user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
        user.Role = (UserRole)request.Role;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<UserResponseDto>(user);
        return ApiResponse<UserResponseDto>.Success(dto, "User created successfully");
    }

    public async Task<ApiResponse<UserResponseDto>> UpdateAsync(int id, UpdateUserRequest request)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null || user.IsDeleted)
            return ApiResponse<UserResponseDto>.Fail("User not found");

        if (await UsernameExistsAsync(request.Username, id))
            return ApiResponse<UserResponseDto>.Fail("Username already exists");

        user.Username = request.Username;
        user.FullName = request.FullName;
        user.Role = (UserRole)request.Role;
        user.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrEmpty(request.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _context.SaveChangesAsync();

        var dto = _mapper.Map<UserResponseDto>(user);
        return ApiResponse<UserResponseDto>.Success(dto, "User updated successfully");
    }

    public async Task<ApiResponse<bool>> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null || user.IsDeleted)
            return ApiResponse<bool>.Fail("User not found");

        user.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.Success(true, "User deleted successfully");
    }

    public async Task<bool> UsernameExistsAsync(string username, int? excludeId = null)
    {
        return await _context.Users
            .AnyAsync(u => u.Username == username && (!excludeId.HasValue || u.Id != excludeId.Value));
    }
}
