# QR Code Scanner Integration - Documentation

## Tổng quan
Tài liệu này mô tả việc tích hợp tính năng scan QR code vào trang Order để staff có thể nhanh chóng thêm sản phẩm vào đơn hàng.

## Cấu trúc tài liệu

### 1. [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- Chi tiết kế hoạch triển khai
- Flow xử lý
- Checklist testing
- Error handling

### 2. [ARCHITECTURE.md](./ARCHITECTURE.md)
- Kiến trúc component
- Data flow
- State management
- Lifecycle management

### 3. [FILES_TO_MODIFY.md](./FILES_TO_MODIFY.md)
- Danh sách files cần tạo/sửa
- Dependencies cần cài đặt
- Cấu trúc file sau khi thay đổi

## Yêu cầu chính

### Tính năng
1. ✅ Thêm nút "Scan" vào CreateOrderForm
2. ✅ Hiển thị QR scanner khi nhấn nút
3. ✅ Scan QR/barcode và lấy product từ API
4. ✅ Hiển thị modal preview product
5. ✅ Lưu product vào orderStore khi xác nhận
6. ✅ Div thông tin đơn hàng tự động cập nhật

### Thư viện
- **html5-qrcode**: QR code scanner library
- **React + TypeScript**: Framework
- **Ant Design**: UI components

## Quick Start (sau khi được duyệt)

1. Cài đặt dependency:
```bash
cd shiny-carnival/frontend
yarn add html5-qrcode@^2.3.8
```

2. Tạo components:
   - `QRCodeScanner.tsx`
   - `ProductPreviewModal.tsx`

3. Sửa `CreateOrderForm.tsx`:
   - Thêm state và handlers
   - Thêm nút Scan
   - Tích hợp scanner và modal

4. Test:
   - Scan QR code
   - Verify product được thêm vào order
   - Verify persist vào localStorage

## Status
📋 **Đang chờ duyệt** - Xin review và approve trước khi bắt đầu implementation.

