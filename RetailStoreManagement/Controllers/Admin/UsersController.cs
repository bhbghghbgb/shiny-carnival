using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("admin/[controller]")]
//[Authorize]
public class UsersController : ControllerBase
{
    private readonly IBaseService<UserEntity, int> _service;

    public UsersController(IBaseService<UserEntity, int> service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserEntity>>> Get(int id)
    {
        return await _service.GetByIdAsync(id);
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IPagedList<UserEntity>>>> GetPaged([FromQuery] PagedRequest request)
    {
        return await _service.GetPagedAsync(request);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserEntity>>> Create([FromBody] UserCreateRequest req)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<UserEntity>.Fail("Invalid request"));
        }

        var entity = new UserEntity
        {
            Username = req.Username,
            Password = req.Password,
            FullName = req.FullName,
            Role = req.Role
        };

        return await _service.CreateAsync(entity);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UserEntity>>> Update(int id, [FromBody] UserUpdateRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<UserEntity>.Fail("Invalid request"));

        var entity = new UserEntity
        {
            Password = req.Password ?? string.Empty,
            FullName = req.FullName,
            Role = req.Role ?? default
        };

        return await _service.UpdateAsync(id, entity);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        return await _service.DeleteAsync(id);
    }
}