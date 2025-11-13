// Page1.xaml.cs

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace UnoApp2.Presentation;

/// <summary>
/// An empty page that can be used on its own or navigated to within a Frame.
/// </summary>
public sealed partial class Page1 : Page
{
    private readonly Page1ViewModel _viewModel;

    public Page1()
    {
        this.InitializeComponent();

        // Manual ViewModel Instantiation (for simple demo)
        _viewModel = new Page1ViewModel();

        // CRITICAL: Set the DataContext so XAML bindings work
        this.DataContext = _viewModel;
    }

    // Optional: Override to manage ViewModel lifecycle if navigating
    protected override void OnNavigatedFrom(NavigationEventArgs e)
    {
        base.OnNavigatedFrom(e);
        // Clean up the background task when the page is closed/navigated away from
        _viewModel.Dispose();
    }
}
