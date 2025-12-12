using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Entities;
using RetailStoreManagement.Interfaces;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("admin/[controller]")]
[Authorize]
public abstract class BaseAdminController<TEntity, TKey> : ControllerBase 
    where TEntity : BaseEntity<TKey>
{
    protected readonly IBaseService<TEntity, TKey> _service;

    public BaseAdminController(IBaseService<TEntity, TKey> service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public virtual async Task<ActionResult<ApiResponse<TEntity>>> Get(TKey id)
    {
        return await _service.GetByIdAsync(id);
    }

    [HttpGet]
    public virtual async Task<ActionResult<ApiResponse<IPagedList<TEntity>>>> GetPaged([FromQuery] PagedRequest request)
    {
        return await _service.GetPagedAsync(request);
    }

    [HttpPost]
    public virtual async Task<ActionResult<ApiResponse<TEntity>>> Create(TEntity entity)
    {
        return await _service.CreateAsync(entity);
    }

    [HttpPut("{id}")]
    public virtual async Task<ActionResult<ApiResponse<TEntity>>> Update(TKey id, TEntity entity)
    {
        return await _service.UpdateAsync(id, entity);
    }

    [HttpDelete("{id}")]
    public virtual async Task<ActionResult<ApiResponse<bool>>> Delete(TKey id)
    {
        return await _service.DeleteAsync(id);
    }
}