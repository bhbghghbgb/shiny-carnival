using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models;
using RetailStoreManagement.Models.UserModel;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("admin/[controller]")]
// [Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    private UserResponse ToResponse(UserEntity entity)
    {
        return new UserResponse
        {
            Id = entity.Id,
            Username = entity.Username,
            FullName = entity.FullName,
            Role = entity.Role
        };
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Get(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<UserResponse>.Fail(result.Message ?? "User not found"));
        }

        return ApiResponse<UserResponse>.Success(ToResponse(result.Data));
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IPagedList<UserResponse>>>> GetPaged([FromQuery] PagedRequest request)
    {
        var result = await _service.GetPagedAsync(request);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<IPagedList<UserResponse>>.Fail(result.Message ?? "No users found"));
        }

        var paged = new PagedList<UserResponse>(
            result.Data.Items.Select(ToResponse),
            result.Data.TotalCount,
            result.Data.Page,
            result.Data.PageSize
        );
        return ApiResponse<IPagedList<UserResponse>>.Success(paged);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Create([FromBody] UserCreateRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<UserResponse>.Fail("Invalid request"));

        var entity = new UserEntity
        {
            Username = req.Username,
            Password = req.Password,
            FullName = req.FullName,
            Role = req.Role
        };

        var result = await _service.CreateAsync(entity);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<UserResponse>.Fail(result.Message ?? "Create failed"));
        }

        return ApiResponse<UserResponse>.Success(ToResponse(result.Data));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> Update(int id, [FromBody] UserUpdateRequest req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<UserResponse>.Fail("Invalid request"));
        }

        var entity = new UserEntity
        {
            Password = req.Password ?? string.Empty,
            FullName = req.FullName,
            Role = req.Role ?? default
        };

        var result = await _service.UpdateAsync(id, entity);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<UserResponse>.Fail(result.Message ?? "Update failed"));
        }

        return ApiResponse<UserResponse>.Success(ToResponse(result.Data));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (result.IsError)
        {
            return BadRequest(result);
        }

        return result;
    }

    [HttpGet("by-name/{fullname}")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> GetByName(string fullname)
    {
        var result = await _service.GetByNameAsync(fullname);
        if (result.IsError || result.Data == null)
        {
            return BadRequest(ApiResponse<UserResponse>.Fail(result.Message ?? "User not found"));
        }
        return ApiResponse<UserResponse>.Success(ToResponse(result.Data));
    }
}