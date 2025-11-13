using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Threading.Tasks;

namespace UnoApp2.Presentation;

// Inherit from ObservableObject to enable property change notification
public partial class Page1ViewModel : ObservableObject
{
    private readonly CancellationTokenSource _cts = new();

    // The counter property with automatic change notification
    [ObservableProperty] private int _counter;

    // The title property is also observable
    [ObservableProperty] private string _title = "Uno MVVM Counter";

    public Page1ViewModel()
    {
        // Start the background counter when the ViewModel is created
        _ = StartAutoIncrementAsync(_cts.Token);
    }

    // Command to increase the counter by 10 (executed by the button)
    // The name will be generated as 'IncreaseByTenCommand'
    [RelayCommand]
    private async Task IncreaseByTenAsync()
    {
        // Simulate a brief asynchronous operation (like saving the click count)
        await Task.Delay(100);
        Counter += 10;
    }

    // Private method to run the background task
    private async Task StartAutoIncrementAsync(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            await Task.Delay(1000, token); // Wait for 1 second
            if (!token.IsCancellationRequested)
            {
                // Note: The UI updates automatically because 'Counter' is an ObservableProperty
                Counter++;
            }
        }
    }

    // To prevent memory leaks, dispose of the CancellationTokenSource when the VM is no longer needed
    public void Dispose()
    {
        _cts.Cancel();
        _cts.Dispose();
    }
}
