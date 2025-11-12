using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using RetailStoreManagement.Common;

namespace RetailStoreManagement.Filters;

public class ApiResponseFilter : IActionFilter, IExceptionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Result is not ObjectResult objectResult)
        {
            return;
        }

        var value = objectResult.Value;
        var type = value?.GetType();

        if (type is { IsGenericType: true } && type.GetGenericTypeDefinition() == typeof(ApiResponse<>))
        {
            // Already an ApiResponse, do nothing
            return;
        }

        var responseType = typeof(ApiResponse<>).MakeGenericType(type ?? typeof(object));
        var response = Activator.CreateInstance(responseType);

        var isErrorProp = responseType.GetProperty("IsError");
        var dataProp = responseType.GetProperty("Data");
        var messageProp = responseType.GetProperty("Message");

        isErrorProp?.SetValue(response, false);
        dataProp?.SetValue(response, value);
        messageProp?.SetValue(response, "Success");

        context.Result = new ObjectResult(response)
        {
            StatusCode = objectResult.StatusCode ?? 200
        };
    }

    public void OnException(ExceptionContext context)
    {
                var response = ApiResponse<object>.Error(context.Exception.Message);
        context.Result = new ObjectResult(response)
        {
            StatusCode = 500
        };
        context.ExceptionHandled = true;
    }
}