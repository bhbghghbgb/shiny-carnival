using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace UnoApp2.Presentation;

// Implements IDisposable for proper cleanup
public partial class Page1ViewModel : ObservableObject, IDisposable
{
    // CancellationTokenSource manages the background task's lifecycle
    private readonly CancellationTokenSource _cts = new();

    [ObservableProperty] private int _counter;

    [ObservableProperty] private string _title = "Uno MVVM Counter";

    public Page1ViewModel()
    {
        // Start the background counter immediately
        _ = StartAutoIncrementAsync(_cts.Token);
    }

    [RelayCommand]
    private async Task IncreaseByTenAsync()
    {
        await Task.Delay(100);
        Counter += 10;
    }

    private async Task StartAutoIncrementAsync(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            try
            {
                await Task.Delay(1000, token); // Wait for 1 second
                Counter++;
            }
            catch (TaskCanceledException)
            {
                // Expected when the CancellationTokenSource is disposed
                break;
            }
        }
    }

    // IDisposable implementation: Called when the framework cleans up the VM
    public void Dispose()
    {
        _cts.Cancel();
        _cts.Dispose();
        GC.SuppressFinalize(this);
    }
}
