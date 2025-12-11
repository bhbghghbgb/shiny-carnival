using UnoApp3.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace UnoApp3.Views;

public sealed partial class LoginPage : Page
{
    public LoginViewModel ViewModel => (LoginViewModel)DataContext;
    
    public LoginPage()
    {
        this.InitializeComponent();
        DataContext = App.Services.GetRequiredService<LoginViewModel>();
    }
}
