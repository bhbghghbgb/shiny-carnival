namespace UnoApp4.Services;

public class AuthHeaderHandler(AuthService authService) : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var token = authService.GetToken();

        if (string.IsNullOrEmpty(token))
        {
            return await base.SendAsync(request, cancellationToken);
        }

        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        this.Log().LogDebug("Added bearer token to request: {Uri}", request.RequestUri);

        return await base.SendAsync(request, cancellationToken);
    }
}
