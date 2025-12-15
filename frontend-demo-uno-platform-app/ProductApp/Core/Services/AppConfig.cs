namespace ProductApp.Core.Services;

public class AppConfig
{
    public bool UseFakeData { get; set; } = true;
    public string BaseApiUrl { get; set; } = "http://10.0.2.2:5000";
    public bool EnableLogging { get; set; } = true;
}
