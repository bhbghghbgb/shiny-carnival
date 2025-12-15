using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using RetailStoreManagement.Common;

namespace RetailStoreManagement.Filters;

/// <summary>
/// Attribute để validate CSRF token cho các API endpoints
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class ValidateCsrfTokenAttribute : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Chỉ validate cho POST, PUT, DELETE, PATCH
        var method = context.HttpContext.Request.Method;
        if (method is "GET" or "HEAD" or "OPTIONS")
        {
            await next();
            return;
        }

        var antiforgery = context.HttpContext.RequestServices.GetRequiredService<IAntiforgery>();
        
        try
        {
            // Validate CSRF token
            await antiforgery.ValidateRequestAsync(context.HttpContext);
            await next();
        }
        catch (Microsoft.AspNetCore.Antiforgery.AntiforgeryValidationException ex)
        {
            var response = ApiResponse<object>.Error("CSRF token validation failed", 403);
            context.Result = new ObjectResult(response)
            {
                StatusCode = 403
            };
        }
    }
}

