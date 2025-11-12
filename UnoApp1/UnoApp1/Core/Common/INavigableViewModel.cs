using Uno.Extensions.Navigation;

namespace UnoApp1.Core.Common;

public interface INavigableViewModel
{
    Task OnNavigatedToAsync();
    Task OnNavigatedFromAsync();
}

public interface ILoadableViewModel
{
    bool IsBusy { get; set; }
    string Title { get; set; }
}
