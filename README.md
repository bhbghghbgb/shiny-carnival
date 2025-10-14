# Project Assignment

**Project – Retail Store Management System**

- Implement a full-featured system with at least **10 core functions** such as:
  1. Customer management
  2. Product management
  3. Discount code / Promotion management
  4. Purchasing (create orders)
  5. Checkout / Point-of-sale (payment at counter)
  6. Revenue statistics and reporting
  7. Employee login and role-based access
  8. Supplier management
  9. Inventory management (stock in/out, updates)
  10. Category management (organize products by category)
  - … and more
- Each function must support the main operations: **Add, Delete, Update, Search, Filter**.
- Students may choose to implement as **ASP.NET MVC Web Application** or as a **Service/API**.
- Week 13–14: Direct evaluation and demonstration in class.

---

**Đề tài – Hệ thống Quản lý Cửa hàng Bán lẻ**

- Xây dựng hệ thống đầy đủ chức năng với ít nhất **10 chức năng chính** như:
  1. Quản lý khách hàng
  2. Quản lý sản phẩm
  3. Quản lý mã giảm giá / khuyến mãi
  4. Mua hàng (tạo đơn hàng)
  5. Thanh toán tại quầy (Point-of-sale)
  6. Thống kê và báo cáo doanh thu
  7. Đăng nhập nhân viên và phân quyền
  8. Quản lý nhà cung cấp
  9. Quản lý tồn kho (nhập/xuất, cập nhật)
  10. Quản lý loại sản phẩm (phân loại hàng hóa)
  - … và các chức năng khác
- Mỗi chức năng phải có các xử lý chính: **Thêm, Xóa, Sửa, Tìm kiếm, Lọc**.
- Sinh viên có thể chọn hướng làm **Web ASP.NET MVC** hoặc **Service/API**.
- Tuần 13–14: Chấm bài trực tiếp trên lớp.

---

# README – Retail Store Management System

## 📌 Overview

This project is a **Retail Store Management System** designed to handle daily operations of a small-to-medium retail shop. It provides modules for managing customers, products, suppliers, promotions, orders, payments, and staff accounts. The system ensures smooth checkout, inventory tracking, and revenue reporting.

## 🚀 Features

- **User Management**: Admin and staff accounts with login and role-based access.
- **Customer Management**: Add, edit, delete, search, filter customers.
- **Product Management**: Manage products, categories, suppliers, and stock.
- **Promotion Management**: Create and apply discount codes.
- **Order Management**: Create orders, apply promotions, track status.
- **Payment Processing**: Support multiple payment methods (cash, card, bank transfer, e-wallet).
- **Inventory Management**: Track stock levels and updates.
- **Supplier Management**: Manage supplier information and link to products.
- **Category Management**: Organize products by categories for easier browsing.
- **Revenue Statistics**: Generate reports on sales and revenue.
- **Search & Filter**: Across all modules.
- **Security**: Role-based access (admin vs staff).
- … and more

## 🗄 Database Schema

### Tables and Relationships

- **users** (`user_id`)  
  → referenced by `orders.user_id` (staff who created the order)

- **customers** (`customer_id`)  
  → referenced by `orders.customer_id`

- **categories** (`category_id`)  
  → referenced by `products.category_id`

- **suppliers** (`supplier_id`)  
  → referenced by `products.supplier_id`

- **products** (`product_id`)  
  → referenced by `inventory.product_id`  
  → referenced by `order_items.product_id`

- **inventory** (`inventory_id`)  
  → one-to-one with `products.product_id`

- **promotions** (`promo_id`)  
  → referenced by `orders.promo_id`

- **orders** (`order_id`)  
  → referenced by `order_items.order_id`  
  → referenced by `payments.order_id`

- **order_items** (`order_item_id`)  
  → belongs to `orders` and `products`

- **payments** (`payment_id`)  
  → belongs to `orders`

### Entity-Relationship Summary

- **One user** can create **many orders**.
- **One customer** can have **many orders**.
- **One order** can have **many order_items**.
- **One product** can appear in **many order_items**.
- **One product** has **one inventory record**.
- **One supplier** provides **many products**.
- **One category** groups **many products**.
- **One promotion** can apply to **many orders**.
- **One order** can have **multiple payments** (partial payments possible).

---

# README – Hệ thống Quản lý Cửa hàng Bán lẻ

## 📌 Tổng quan

Đây là dự án **Hệ thống Quản lý Cửa hàng Bán lẻ**, hỗ trợ các nghiệp vụ thường ngày của một cửa hàng bán lẻ vừa và nhỏ. Hệ thống bao gồm các module quản lý khách hàng, sản phẩm, nhà cung cấp, khuyến mãi, đơn hàng, thanh toán và tài khoản nhân viên. Mục tiêu là đảm bảo quy trình bán hàng, quản lý tồn kho và báo cáo doanh thu được thuận tiện.

## 🚀 Chức năng

- **Quản lý người dùng**: Tài khoản admin và nhân viên, đăng nhập, phân quyền.
- **Quản lý khách hàng**: Thêm, sửa, xóa, tìm kiếm, lọc.
- **Quản lý sản phẩm**: Quản lý sản phẩm, loại hàng, nhà cung cấp, tồn kho.
- **Quản lý khuyến mãi**: Tạo và áp dụng mã giảm giá.
- **Quản lý đơn hàng**: Tạo đơn, áp dụng khuyến mãi, theo dõi trạng thái.
- **Thanh toán**: Hỗ trợ nhiều phương thức (tiền mặt, thẻ, chuyển khoản, ví điện tử).
- **Quản lý tồn kho**: Theo dõi số lượng và cập nhật.
- **Quản lý nhà cung cấp**: Quản lý thông tin nhà cung cấp, liên kết sản phẩm.
- **Quản lý loại sản phẩm**: Phân loại sản phẩm theo nhóm.
- **Thống kê doanh thu**: Báo cáo bán hàng và doanh thu.
- **Tìm kiếm & Lọc**: Trên tất cả các module.
- **Bảo mật**: Phân quyền theo vai trò (admin/nhân viên).
- … và các chức năng khác

## 🗄 Mô hình CSDL

### Bảng và quan hệ

- **users** (`user_id`)  
  → được tham chiếu bởi `orders.user_id` (nhân viên tạo đơn)

- **customers** (`customer_id`)  
  → được tham chiếu bởi `orders.customer_id`

- **categories** (`category_id`)  
  → được tham chiếu bởi `products.category_id`

- **suppliers** (`supplier_id`)  
  → được tham chiếu bởi `products.supplier_id`

- **products** (`product_id`)  
  → được tham chiếu bởi `inventory.product_id`  
  → được tham chiếu bởi `order_items.product_id`

- **inventory** (`inventory_id`)  
  → quan hệ 1-1 với `products.product_id`

- **promotions** (`promo_id`)  
  → được tham chiếu bởi `orders.promo_id`

- **orders** (`order_id`)  
  → được tham chiếu bởi `order_items.order_id`  
  → được tham chiếu bởi `payments.order_id`

- **order_items** (`order_item_id`)  
  → thuộc về `orders` và `products`

- **payments** (`payment_id`)  
  → thuộc về `orders`

### Tóm tắt quan hệ

- **Một nhân viên** có thể tạo **nhiều đơn hàng**.
- **Một khách hàng** có thể có **nhiều đơn hàng**.
- **Một đơn hàng** có thể có **nhiều chi tiết đơn hàng**.
- **Một sản phẩm** có thể xuất hiện trong **nhiều chi tiết đơn hàng**.
- **Một sản phẩm** có **một bản ghi tồn kho**.
- **Một nhà cung cấp** cung cấp **nhiều sản phẩm**.
- **Một loại sản phẩm** chứa **nhiều sản phẩm**.
- **Một khuyến mãi** có thể áp dụng cho **nhiều đơn hàng**.
- **Một đơn hàng** có thể có **nhiều thanh toán** (cho phép trả góp/chi trả nhiều lần).
