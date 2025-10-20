# Software Requirement Specification (SRS) for Store Management System

## Table of Contents

1. [Introduction](#introduction)
   1.1. [Purpose](#purpose)
   1.2. [Scope](#scope)
   1.3. [Definitions, Acronyms, and Abbreviations](#definitions-acronyms-and-abbreviations)
   1.4. [References](#references)
   1.5. [Overall Document](#overall-document)
2. [Overall Description](#overall-description)
   2.1. [Systems View](#systems-view)
   2.2. [User Characteristics](#user-characteristics)
3. [Specific Requirements](#specific-requirements)
   3.1. [Functional Requirements](#functional-requirements)
   3.2. [Non-Functional Requirements](#non-functional-requirements)

## 1. Introduction

### 1.1. Purpose

Mục đích của tài liệu này là xác định các yêu cầu chức năng và phi chức năng của hệ thống quản lý cửa hàng. Hệ thống sẽ cung cấp một nền tảng để quản lý các hoạt động kinh doanh cốt lõi của một cửa hàng bán lẻ, bao gồm quản lý sản phẩm, hàng tồn kho, đơn hàng, khách hàng, và các chương trình khuyến mãi.

### 1.2. Scope

Hệ thống quản lý cửa hàng sẽ hỗ trợ các chức năng sau:

#### 1.2.1. Quản trị viên (Admin)

* Quản lý tài khoản người dùng (staff, admin).
* Quản lý sản phẩm (thêm, sửa, xóa).
* Quản lý danh mục sản phẩm.
* Quản lý nhà cung cấp.
* Quản lý chương trình khuyến mãi.
* Xem thống kê và báo cáo kinh doanh.
* Xem lại các đơn hàng đã tạo

#### 1.2.2. Nhân viên (Staff)

* Xử lý đơn hàng của khách hàng.
* Quản lý thông tin khách hàng.
* Cập nhật trạng thái đơn hàng (vừa tạo, đã thành công, đã hủy).
* Quản lý hàng tồn kho.
* Thực hiện thanh toán (Tức là tạo đơn hàng (order, order_item, xác nhận khách đã thanh toán thành công, xong rồi cập nhật trạng thái đơn hàng).
* Xem lại các đơn hàng đã tạo

### 1.3. Definitions, Acronyms, and Abbreviations

* **SRS (Software Requirement Specification):** Tài liệu đặc tả yêu cầu phần mềm.
* **ERD (Entity-Relationship Diagram):** Sơ đồ quan hệ thực thể.
* **UI (User Interface):** Giao diện người dùng.
* **API (Application Programming Interface):** Giao diện lập trình ứng dụng.

### 1.4. References

* Tài liệu phân tích ERD hệ thống quản lý cửa hàng.
* Tài liệu mẫu SRS cho website thương mại điện tử.

### 1.5. Overall Document

Tài liệu này bao gồm mô tả tổng quan về hệ thống, các yêu cầu chức năng và phi chức năng, đặc điểm người dùng, và các ràng buộc của hệ thống quản lý cửa hàng.

## 2. Overall Description

### 2.1. Systems View

* Hệ thống là một ứng dụng web nội bộ cho cửa hàng.
* Kiến trúc hệ thống có thể theo mô hình client-server (API).
* Dữ liệu được lưu trữ trong một hệ quản trị cơ sở dữ liệu quan hệ (ví dụ: MySQL, PostgreSQL).

### 2.2. User Characteristics

* **Quản trị viên (Admin):** Người có quyền cao nhất trong hệ thống, chịu trách nhiệm quản lý toàn bộ hoạt động của cửa hàng trên phần mềm.
* **Nhân viên (Staff):** Người trực tiếp sử dụng hệ thống để thực hiện các nghiệp vụ hàng ngày như bán hàng, quản lý kho.
* **Người dùng(User):** Người dùng hệ thống (Admin và Staff)

## 3. Specific Requirements

### 3.1. Functional Requirements

| ID     | Tên yêu cầu                                                  | Mô tả                                                        |
| :----- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| FR-001 | Quản lý người dùng                                           | Hệ thống cho phép Admin tạo, sửa, xóa cho các tài khoản. Thêm mới thì mặc định là staff. |
| FR-002 | Quản lý sản phẩm                                             | Hệ thống cho phép Admin thêm sản phẩm mới, cập nhật thông tin sản phẩm hiện có (tên, giá, mã vạch) và xóa sản phẩm. <br/>Người dùng có thể tìm kiếm sản phẩm theo tên, mã vạch, hoặc lọc theo danh mục và nhà cung cấp để dễ dàng thêm vào đơn hàng. |
| FR-003 | Quản lý đơn hàng                                             | Nhân viên có thể tạo đơn hàng mới cho khách hàng (tạo order), thêm sản phẩm vào đơn hàng (tạo order_item), và cập nhật trạng thái của đơn hàng (ví dụ: đang xử lý, đã thành công, đã hủy).<br/>Nhân viên có thể sửa đổi số lượng sản phẩm trong một chi tiết đơn hàng hoặc xóa một chi tiết đơn hàng khỏi đơn hàng trước khi thanh toán. Sau khi thanh toán và xuất phiếu thì không thể chỉnh sửa các đơn hàng đã lưu trong hệ thống nữa.<br/>Người dùng có thể xem lại chi tiết một đơn hàng, bao gồm danh sách các sản phẩm, số lượng, giá, tổng phụ và tổng tiền. |
| FR-004 | Quản lý khách hàng                                           | Hệ thống cho phép người dùng thêm mới và quản lý thông tin khách hàng, bao gồm tên, số điện thoại, email và địa chỉ. |
| FR-005 | Quản lý tồn kho                                              | Hệ thống tự động cập nhật số lượng tồn kho khi có đơn hàng mới được tạo hoặc hủy. Nhân viên có thể xem và cập nhật số lượng tồn kho của sản phẩm.<br/>Hệ thống tự động gửi cảnh báo cho Admin hoặc nhân viên khi số lượng tồn kho của một sản phẩm xuống dưới mức an toàn đã định, sẽ tiến hành gửi cho các Admin qua email. |
| FR-006 | Quản lý nhà cung cấp                                         | Admin có thể quản lý thông tin của các nhà cung cấp, bao gồm tên, thông tin liên hệ và địa chỉ. |
| FR-007 | Quản lý danh mục sản phẩm                                    | Admin có thể tạo, sửa, và xóa các danh mục sản phẩm để phân loại sản phẩm một cách khoa học. |
| FR-008 | Quản lý khuyến mãi                                           | Admin có thể tạo và quản lý các chương trình khuyến mãi, bao gồm mã giảm giá, phần trăm hoặc số tiền giảm giá cố định cho mã giảm giá hoặc chương trình khuyén mãi, ngày bắt đầu và kết thúc.<br/>Admin có thể kích hoạt hoặc vô hiệu hóa các chương trình khuyến mãi dựa trên trạng thái (active/inactive) và ngày bắt đầu/kết thúc.<br/>Hệ thống tự động theo dõi số lần sử dụng của mỗi mã khuyến mãi và ngăn chặn việc sử dụng vượt quá giới hạn (usage_limit). |
| FR-009 | Thanh toán                                                   | Hệ thống chỉ hổ trợ thanh toán tiền mặt. Thông tin thanh toán được ghi lại cho mỗi đơn hàng, trong database lưu lại trạng thái đơn hàng để dùng luôn cho thanh toán, VD: trạng thái đơn hàng đã thành công tức là người mua đã thanh toán rồi. (Chức năng này khả năng không thể lấy làm chức năng chính vì không có gì xữ lý nhiều) |
| FR-010 | Báo cáo và thống kê                                          | Hệ thống cung cấp cho Admin các báo cáo về doanh thu, sản phẩm bán chạy, và các thống kê khác theo ngày, tuần, tháng để hỗ trợ việc ra quyết định kinh doanh. |
| FR-011 | Đăng nhập và xác thực người dùng                             | Hệ thống cho phép người dùng (Admin, Staff) đăng nhập an toàn bằng tên đăng nhập và mật khẩu, đồng thời xác thực vai trò truy cập. |
| FR-012 | Xuất PDF thông tin đơn hàng (Thực ra là xuất hóa đơn nhưng trong hệ thống không có database hóa đơn nên sẽ dùng đơn hàng thay thế) | Sau khi đã xác nhận thanh toán thành công và cập nhật trạng thái đơn hàng là đã thành công thì tiến thì tiến hành xuất hóa đơn. |

### 3.2. Non-Functional Requirements

| ID    | Tên yêu cầu                                                                          |
|:----- |:------------------------------------------------------------------------------------ |
| NFR-1 | Hệ thống phải có giao diện thân thiện, dễ sử dụng.                                   |
| NFR-2 | Thời gian phản hồi của hệ thống phải nhanh, dưới 2 giây cho các tác vụ thông thường. |
| NFR-3 | Dữ liệu phải được sao lưu định kỳ để đảm bảo an toàn.                                |
| NFR-4 | Hệ thống phải có khả năng hoạt động ổn định 24/7.                                    |
