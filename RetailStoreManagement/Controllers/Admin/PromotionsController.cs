using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Interfaces;
using RetailStoreManagement.Models.DTOs.Promotions;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class PromotionsController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public PromotionsController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<PromotionListDto>>>> GetPromotions([FromQuery] PagedRequest request, [FromQuery] string? status = null)
    {
        var result = await _promotionService.GetPagedAsync(request, status);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<PromotionResponseDto>>> GetPromotion(int id)
    {
        var result = await _promotionService.GetByIdAsync(id);
        return result.IsError ? NotFound(result) : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<PromotionResponseDto>>> CreatePromotion([FromBody] CreatePromotionRequest request)
    {
        var result = await _promotionService.CreateAsync(request);
        return result.IsError ? BadRequest(result) : CreatedAtAction(nameof(GetPromotion), new { id = result.Data!.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<PromotionResponseDto>>> UpdatePromotion(int id, [FromBody] UpdatePromotionRequest request)
    {
        request.Id = id;
        var result = await _promotionService.UpdateAsync(id, request);
        return result.IsError ? BadRequest(result) : Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeletePromotion(int id)
    {
        var result = await _promotionService.DeleteAsync(id);
        return result.IsError ? NotFound(result) : Ok(result);
    }

    [HttpPost("validate")]
    public async Task<ActionResult<ApiResponse<ValidatePromoResponse>>> ValidatePromotion([FromBody] ValidatePromoRequest request)
    {
        var result = await _promotionService.ValidatePromoCodeAsync(request);
        return Ok(result);
    }
}
