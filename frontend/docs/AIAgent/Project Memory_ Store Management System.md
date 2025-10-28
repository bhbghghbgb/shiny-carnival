# Project Memory: Store Management System
## 1. Project Overview
- **Project Name:** Store Management System.
- **Objective:** To build an internal web application to manage core business operations of a retail store, including products, inventory, orders, customers, and promotions.
- **Architecture:** The system follows a client-server model, comprising a React frontend and a backend providing a RESTful API.
- **Database:** Uses a relational database management system (MySQL).
## 2. Frontend Technology and Structure
- **Language:** TypeScript.
- **Main Library:** React.
- **Folder Structure:** Based on Clean Architecture principles and Feature-Sliced Design (FSD). Code is organized by `features` (business logic) rather than by technical type.
- **UI Components:** Uses the Ant Design (AntD) library.
- **State Management:** Uses Zustand for global and local state management per feature.
- **Data Grids:** Uses TanStack Table (headless UI) to display data in a table format.
- **Form Management:** Uses Ant Design Form components with built-in validation and controls.
- **API Calls:** Uses Axios, with a pre-configured instance (interceptors for token and error handling).
- **Routing:** Uses TanStack's Code-Based Routing.
## 3. Backend and API Structure
- **Authentication:** Uses JSON Web Token (JWT). The token is sent via the `Authorization: Bearer <token>` header.
- **API Conventions:**
  - **Data Format:** JSON (`application/json`).
  - **Naming Convention (JSON):** `camelCase` (e.g., `productId`).
  - **Response Structure:** All responses have a common `ApiResponse<T>` structure including fields `isError`, `message`, `data`, and `timestamp`.
  - **Pagination:** List retrieval APIs support pagination with parameters `page`, `pageSize`, `search`, `sortBy`, `sortDesc` and return a `PagedList<T>` structure.
## 4. Main Functions and Business Logic (Features)
- **Users:** Has 2 roles: `Admin` and `Staff`.
  - `Admin`: Manages users, products, categories, suppliers, promotions, views reports.
  - `Staff`: Processes orders, manages customers, updates inventory, performs payments.
- **Products:** Manages product information, including name, price, barcode, category, supplier.
- **Orders:** Staff create orders, add products (`Order_Items`), apply promotions, and update status (`pending`, `paid`, `canceled`).
- **Customers:** Manages customer information.
- **Inventory:** The system automatically updates inventory when orders are created or canceled. Alerts are issued when inventory falls below a safe level.
- **Promotions:** Admin creates and manages promotion programs (code, discount type, duration, usage limits).
- **Payments:** The system only supports cash payments. An order status of `paid` is equivalent to paid.
- **Reports:** Admin can view sales reports and best-selling products.
- **Export PDF:** After an order is successfully paid, the system can export an invoice (based on order information) to a PDF file.
## 5. Data Model (ERD)
- **Main Entities:** `Users`, `Customers`, `Categories`, `Suppliers`, `Products`, `Inventory`, `Promotions`, `Orders`, `Order_Items`, `Payments`.
- **Key Relationships:**
  - `Customers` 1-N `Orders`
  - `Users` 1-N `Orders` (Staff processing orders)
  - `Orders` 1-N `Order_Items`
  - `Products` 1-N `Order_Items`
  - `Categories` 1-N `Products`
  - `Suppliers` 1-N `Products`
  - `Products` 1-1 `Inventory`

