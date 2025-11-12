Help me generate an uno platform frontend project, divide to tasks as needed, following the prompt and the backend dtos below:

## 🧠 Prompt: Uno Platform Mobile App Scaffold

### 📘 Background Context

This project is built using **Uno Platform**, a C# and XAML–based framework that enables **cross-platform apps** (Android, iOS, WebAssembly, Windows, macOS, Linux) from a **single codebase**.
The architecture should follow modern .NET best practices similar to Jetpack Compose + Retrofit + Room in Android/Kotlin — but using the C#/.NET equivalents:

* **MVVM pattern** for separation of UI and logic
* **Dependency Injection (DI)** for managing services and repositories
* **Refit** (typed HTTP client) for calling REST APIs
* **SQLite + Entity Framework Core** for local storage and persistence

---

### 🧩 Functional Requirements

* **Backend** expose:

  * api fetch product list/detail/etc
  * api — place an order

  (note): see provided dtos for clearer context, prefix all routes with "/api/admin". If product image links not provided in the dto, resolve them with "/images/product/{id}.png"

* **Mobile app flow:**

  1. User opens app → sees **Login Page** → enters credentials
  2. On successful login → navigate to **Home Page**
  3. Home Page shows list of products (with search box and filter tabs)
  4. User selects a product → navigates to **Product Detail Page**
  5. User can **Add to Cart** (stored locally in SQLite)
  6. User navigates to **Cart Page** → reviews items → presses “Confirm Purchase”
  7. On confirmation → call backend order API
  8. If success → clear cart (local DB) and show confirmation message

---

### 🧱 Architecture & Tech Stack

* **UI Framework:** Uno Platform (XAML + C#)
* **Architecture Pattern:** MVVM
* **Dependency Injection:** `Microsoft.Extensions.DependencyInjection`
* **API Client:** `Refit` (for declarative HTTP API interfaces)
* **Local Database:** `SQLite` with `Entity Framework Core`
* **Navigation:** Uno Navigation (Frame or Uno.Extensions.Navigation)
* **State Management:** via ViewModels with `INotifyPropertyChanged` and `ObservableCollection<T>`
* **HTTP Models:** DTOs for Product, CartItem, OrderRequest, OrderResponse
* **Authentication:** Basic login with API call (no registration route needed)
* **Error Handling:** Display error messages for network or login failures
* **Offline Mode:** Cart persists locally via SQLite even when offline
* **Styling:** Use consistent colors and XAML styles for buttons, text fields, and app theme

---

### 🧭 Routes / Pages

1. **LoginPage**

   * Username, password fields
   * Login button → calls API via Refit
   * On success → navigate to HomePage

2. **HomePage**

   * Search bar on top
   * Product list (grid or list view)
   * Tabs or filters for categories
   * Clicking a product → navigates to ProductDetailPage

3. **ProductDetailPage**

   * Shows product details
   * “Add to Cart” button → saves to SQLite via EF Core repository

4. **CartPage**

   * Lists products stored in local DB
   * “Confirm Purchase” button → calls backend `POST /order`
   * On success → clear local DB

5. **OrderConfirmationPage**

   * Simple “Order placed successfully!” screen

---

### ⚙️ Additional Requirements

* Provide DI setup (`IServiceCollection` registration for Refit client, DbContext, repositories, and ViewModels).
* Include a context/service layer to encapsulate API calls (e.g., `IProductApi`, `IAuthApi`).
* Handle local DB initialization and migrations on first launch.
* Show how to build for **Android** using Uno Platform tooling.
* Explain how the **Android emulator** or **device** can access a backend running on the developer’s machine

---

### 🧩 Deliverables (for the AI or generator)

Generate:

1. **Project folder structure** (with shared, Android, and model/viewmodel/service layers)
2. **Code** for:

   * ViewModels (Home, ProductDetail, Cart, Login)
   * Refit API interfaces (`IAuthApi`, `IProductApi`)
   * EF Core DbContext and Cart repository
   * DI setup (`App.xaml.cs` or equivalent)
3. **Navigation setup** and route definitions
4. **UI pages (XAML + ViewModels)** with demonstrating data binding
5. **Instructions** for running on Android and configuring localhost API connection
6. Add any other best practices structures/libraries/handling as you see fit.
