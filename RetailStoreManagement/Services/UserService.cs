using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.User;
using BCrypt.Net;

namespace RetailStoreManagement.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<PagedList<UserResponseDto>>> GetUsersAsync(PagedRequest request)
    {
        try
        {
            var query = _unitOfWork.Users.GetQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(u => u.Username.Contains(request.Search) ||
                                        u.FullName!.Contains(request.Search));
            }

            // Apply sorting
            query = request.SortDesc
                ? query.OrderByDescending(u => EF.Property<object>(u, request.SortBy))
                : query.OrderBy(u => EF.Property<object>(u, request.SortBy));

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var userDtos = _mapper.Map<List<UserResponseDto>>(items);
            var pagedList = new PagedList<UserResponseDto>(userDtos, request.Page, request.PageSize, totalCount);

            return ApiResponse<PagedList<UserResponseDto>>.Success(pagedList);
        }
        catch (Exception ex)
        {
            return ApiResponse<PagedList<UserResponseDto>>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<UserResponseDto>> GetUserByIdAsync(int id)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
            {
                return ApiResponse<UserResponseDto>.Error("User not found", 404);
            }

            var userDto = _mapper.Map<UserResponseDto>(user);
            return ApiResponse<UserResponseDto>.Success(userDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<UserResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<UserResponseDto>> CreateUserAsync(CreateUserRequest request)
    {
        try
        {
            // Check if username already exists
            var existingUser = await _unitOfWork.Users.GetQueryable()
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (existingUser != null)
            {
                return ApiResponse<UserResponseDto>.Error("Username already exists", 409);
            }

            var user = _mapper.Map<UserEntity>(request);
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();

            var userDto = _mapper.Map<UserResponseDto>(user);
            return ApiResponse<UserResponseDto>.Success(userDto, "User created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<UserResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<UserResponseDto>> UpdateUserAsync(int id, UpdateUserRequest request)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
            {
                return ApiResponse<UserResponseDto>.Error("User not found", 404);
            }

            // Check if username already exists (excluding current user)
            var existingUser = await _unitOfWork.Users.GetQueryable()
                .FirstOrDefaultAsync(u => u.Username == request.Username && u.Id != id);

            if (existingUser != null)
            {
                return ApiResponse<UserResponseDto>.Error("Username already exists", 409);
            }

            _mapper.Map(request, user);

            // Hash password if provided
            if (!string.IsNullOrEmpty(request.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            }

            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            var userDto = _mapper.Map<UserResponseDto>(user);
            return ApiResponse<UserResponseDto>.Success(userDto, "User updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<UserResponseDto>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<bool>> DeleteUserAsync(int id)
    {
        try
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
            {
                return ApiResponse<bool>.Error("User not found", 404);
            }

            await _unitOfWork.Users.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.Success(true, "User deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.Error(ex.Message);
        }
    }

    public async Task<ApiResponse<UserResponseDto>> SetupAdminAsync(CreateUserRequest request)
    {
        // Check if an admin user already exists
        var adminExists = await _unitOfWork.Users.GetQueryable().AnyAsync(u => u.Role == Enums.UserRole.Admin);
        if (adminExists)
        {
            return ApiResponse<UserResponseDto>.Error("An admin account already exists.", 409);
        }

        // Ensure the request is for creating an admin
        if (request.Role != (int)Enums.UserRole.Admin)
        {
            return ApiResponse<UserResponseDto>.Error("This endpoint is only for creating an admin account.", 400);
        }

        return await CreateUserAsync(request);
    }
}
