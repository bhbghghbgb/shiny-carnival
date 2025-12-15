Help me generate an uno platform frontend project, divide to tasks as needed, following the prompt and the backend dtos below:

```
Build a **Uno Platform cross-platform app** (Android-first) using:
**MVVM**, **Dependency Injection (DI)**, **Refit** for API calls, and **SQLite + Entity Framework Core** for local storage.

**App flow:**

* Login page (username/password only, no register).
* After login → Home page shows product list (with search box and filter tabs).
* Product detail page → “Add to Cart” → stores locally via SQLite (EF Core).
* Cart page → list local items → “Confirm Purchase” → calls backend `POST /order`.
* On success → clear cart → show order confirmation page.

**Backend endpoints:**
`GET /products`, `POST /order`, `POST /login`.

**Architecture & tech:**

* Uno Platform (C# + XAML) UI
* MVVM with ViewModels (Login, Home, ProductDetail, Cart)
* DI setup using `Microsoft.Extensions.DependencyInjection`
* Refit for typed API clients (`IAuthApi`, `IProductApi`)
* SQLite local DB with EF Core (`AppDbContext`, `CartRepository`)
* Navigation via Uno.Extensions.Navigation
* Persistent cart data offline
* Proper error handling for API and login

**Additional:**

* Read images of products from /images/product/{id}.png, use lazy loading and default loading/errored image if possible
* Explain how to access a localhost backend from Android (`http://10.0.2.2:<port>` for emulator, LAN IP for device).
* Include DI setup, folder structure, navigation setup, and minimal example pages with bindings.
* Target: quickly scaffold a working app skeleton ready for Android build with fake data. Then connect to backend. If UI code is simple, then write it directly in the scaffold step, else write a simple one that but shows enough data and then improve it later.

```