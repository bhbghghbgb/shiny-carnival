using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RetailStoreManagement.Common;
using RetailStoreManagement.Models.Common;
using RetailStoreManagement.Interfaces.Services;
using RetailStoreManagement.Models.Promotion;

namespace RetailStoreManagement.Controllers.Admin;

[ApiController]
[Route("api/admin/promotions")]
[Authorize(Roles = "Admin")]
public class PromotionsController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public PromotionsController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPromotions([FromQuery] PromotionSearchRequest request)
    {
        var result = await _promotionService.GetPromotionsAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPromotion(int id)
    {
        var result = await _promotionService.GetPromotionByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePromotion([FromBody] CreatePromotionRequest request)
    {
        var result = await _promotionService.CreatePromotionAsync(request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePromotion(int id, [FromBody] UpdatePromotionRequest request)
    {
        var result = await _promotionService.UpdatePromotionAsync(id, request);
        return StatusCode(result.StatusCode, result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePromotion(int id)
    {
        var result = await _promotionService.DeletePromotionAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPost("validate")]
    public async Task<IActionResult> ValidatePromotion([FromBody] ValidatePromoRequest request)
    {
        var result = await _promotionService.ValidatePromotionAsync(request);
        return StatusCode(result.StatusCode, result);
    }
}
