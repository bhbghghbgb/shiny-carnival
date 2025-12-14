namespace UnoApp4.Services;

public class AuthHeaderHandler(
    AuthService authService,
    IAuthenticationService authenticationService)
    : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        // Skip auth for login endpoint
        var path = request.RequestUri?.AbsolutePath ?? "";
        if (path.EndsWith("/Auth/login", StringComparison.OrdinalIgnoreCase))
        {
            return await base.SendAsync(request, cancellationToken);
        }

        var token = authService.GetToken();

        if (!string.IsNullOrEmpty(token))
        {
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }

        var response = await base.SendAsync(request, cancellationToken);

        // If 401, try to refresh token and retry once
        if (response.StatusCode != System.Net.HttpStatusCode.Unauthorized)
        {
            return response;
        }

        this.Log().LogWarning("Received 401, attempting token refresh");

        var refreshed = await authenticationService.RefreshAsync(cancellationToken);

        if (refreshed)
        {
            this.Log().LogInformation("Token refreshed, retrying request");

            // Get new token and retry request
            token = authService.GetToken();
            if (string.IsNullOrEmpty(token))
            {
                return response;
            }

            request.Headers.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            response = await base.SendAsync(request, cancellationToken);
        }
        else
        {
            this.Log().LogWarning("Token refresh failed, user needs to login again");
        }

        return response;
    }
}
