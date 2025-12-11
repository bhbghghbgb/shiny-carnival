using UnoApp3.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace UnoApp3.Views;

public sealed partial class LoginPage : Page
{
    public LoginViewModel ViewModel => (LoginViewModel)DataContext;
    
    public LoginPage()
    {
        this.InitializeComponent();
        // DataContext will be automatically set by Uno.Extensions navigation
        // DataContext = App.Services.GetRequiredService<LoginViewModel>();
    }
}
