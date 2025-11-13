namespace UnoApp1.Core.Common;

public interface INavigableViewModel
{
    Task OnNavigatedToAsync(IDictionary<string, object>? parameters = null);
    Task OnNavigatedFromAsync();
}

public interface ILoadableViewModel
{
    bool IsBusy { get; set; }
    string Title { get; set; }
}
