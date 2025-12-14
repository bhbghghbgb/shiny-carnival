using UnoApp4.Services.Interfaces;

namespace UnoApp4.Services;

using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

public class AuthTokenHandler(IAuthService authService) : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        // Skip adding Authorization header for login endpoint
        if (request.RequestUri == null ||
            request.RequestUri.AbsolutePath.Contains("/Auth/login", StringComparison.OrdinalIgnoreCase))
        {
            return await base.SendAsync(request, cancellationToken);
        }

        var token = authService.GetAccessToken();
        if (!string.IsNullOrEmpty(token))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            this.Log().LogDebug("Added Bearer token to request: {Url}", request.RequestUri);
        }
        else
        {
            this.Log().LogWarning("No token available for request: {Url}", request.RequestUri);
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
