# QR Code Scanner Integration - Implementation Plan

## Tổng quan
Thêm tính năng scan QR code vào trang Order để staff có thể nhanh chóng thêm sản phẩm vào đơn hàng bằng cách quét mã vạch/QR code.

## Thư viện sử dụng
- **html5-qrcode** (v2.3.8+): Thư viện chính để scan QR code và barcode
- **React + TypeScript**: Framework và ngôn ngữ
- **Ant Design**: UI components (Modal, Button, Card, Descriptions)

## Phân tích yêu cầu

### 1. Tính năng chính
- ✅ Thêm nút "Scan" vào CreateOrderForm (trong Card "Thêm sản phẩm")
- ✅ Khi nhấn nút, hiển thị màn hình QR scanner (thay thế div thông tin đơn hàng)
- ✅ Sau khi scan thành công:
  - Lấy nội dung QR (barcode)
  - Gọi `productApiService.searchByBarcode()` để lấy product
  - Hiển thị modal preview product (tạm dừng scanner)
  - Khi staff xác nhận (OK), lưu vào `orderStore`
  - Div thông tin đơn hàng tự động hiển thị product từ store (đã persist)

### 2. Flow xử lý
```
User clicks "Scan" button
  ↓
Show QR Scanner (replace order info div)
  ↓
User scans QR/Barcode
  ↓
Get barcode from scan result
  ↓
Call productApiService.searchByBarcode(barcode)
  ↓
If product found:
  - Pause scanner
  - Show ProductPreviewModal with product info
  - Wait for user confirmation
  ↓
User clicks "OK" in modal
  ↓
Add product to orderStore (with quantity = 1)
  ↓
Close modal & scanner
  ↓
Order info div shows updated products from store
```

## Cấu trúc files cần tạo/sửa

### Files mới cần tạo:
1. **`src/features/orders/components/QRCodeScanner.tsx`**
   - Component wrapper cho html5-qrcode
   - Props: `onScanSuccess`, `onScanError`, `onClose`
   - Quản lý lifecycle của scanner (start/stop)

2. **`src/features/orders/components/ProductPreviewModal.tsx`**
   - Modal hiển thị thông tin product sau khi scan
   - Props: `product`, `open`, `onConfirm`, `onCancel`
   - Hiển thị: productName, barcode, price, unit, inventoryQuantity
   - Buttons: "OK" (confirm), "Hủy" (cancel)

### Files cần sửa:
1. **`src/features/orders/components/CreateOrderForm.tsx`**
   - Thêm state: `isScanning`, `scannedProduct`
   - Thêm nút "Scan" trong Card "Thêm sản phẩm"
   - Thêm logic xử lý scan:
     - Hiển thị QRCodeScanner khi `isScanning = true`
     - Gọi API khi scan thành công
     - Hiển thị ProductPreviewModal
     - Lưu vào store khi confirm

2. **`package.json`**
   - Thêm dependency: `html5-qrcode@^2.3.8`
   - Thêm types: `@types/html5-qrcode` (nếu có)

## Chi tiết implementation

### 1. QRCodeScanner Component

**Location**: `src/features/orders/components/QRCodeScanner.tsx`

**Props**:
```typescript
interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose: () => void;
  visible: boolean;
}
```

**Features**:
- Sử dụng `Html5QrcodeScanner` từ html5-qrcode
- Config: fps: 10, qrbox: { width: 300, height: 300 }
- Cleanup khi unmount
- Stop scanner khi close

### 2. ProductPreviewModal Component

**Location**: `src/features/orders/components/ProductPreviewModal.tsx`

**Props**:
```typescript
interface ProductPreviewModalProps {
  product: ProductEntity | null;
  open: boolean;
  onConfirm: (product: ProductEntity) => void;
  onCancel: () => void;
  loading?: boolean;
}
```

**UI**:
- Sử dụng Ant Design Modal
- Descriptions để hiển thị: Tên, Mã vạch, Giá, Đơn vị, Tồn kho
- Buttons: "Xác nhận" (primary), "Hủy"

### 3. CreateOrderForm Updates

**Thêm state**:
```typescript
const [isScanning, setIsScanning] = useState(false);
const [scannedProduct, setScannedProduct] = useState<ProductEntity | null>(null);
const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
const [isSearchingProduct, setIsSearchingProduct] = useState(false);
```

**Thêm handlers**:
- `handleScanClick`: Mở scanner
- `handleScanSuccess`: Xử lý khi scan thành công
- `handleConfirmProduct`: Lưu product vào store
- `handleCancelScan`: Đóng scanner

**UI Changes**:
- Thêm Button "Scan" bên cạnh "Thêm vào đơn hàng"
- Conditional render: Nếu `isScanning`, hiển thị QRCodeScanner thay vì div thông tin đơn hàng

## Dependencies

### Cần cài đặt:
```bash
yarn add html5-qrcode@^2.3.8
```

### Type definitions:
- html5-qrcode có sẵn TypeScript definitions
- Không cần @types package riêng

## Testing checklist

- [ ] Nút Scan hiển thị đúng vị trí
- [ ] Click nút Scan mở scanner
- [ ] Scanner hiển thị camera feed
- [ ] Scan QR code thành công lấy được barcode
- [ ] Gọi API searchByBarcode đúng
- [ ] Hiển thị ProductPreviewModal khi tìm thấy product
- [ ] Hiển thị error message khi không tìm thấy product
- [ ] Click OK trong modal lưu product vào store
- [ ] Div thông tin đơn hàng cập nhật sau khi lưu
- [ ] Product được persist vào localStorage
- [ ] Scanner cleanup khi đóng
- [ ] Handle lỗi camera permission
- [ ] Handle product đã tồn tại trong order

## Error handling

1. **Camera permission denied**: Hiển thị message yêu cầu cấp quyền
2. **Product not found**: Hiển thị message "Không tìm thấy sản phẩm với mã vạch này"
3. **Product already in order**: Hiển thị warning và không thêm lại
4. **API error**: Hiển thị error message từ API
5. **Scanner error**: Log error và tiếp tục scan

## UI/UX Considerations

1. **Scanner UI**: 
   - Full width trong div thông tin đơn hàng
   - Có nút "Đóng" để quay lại
   - Hiển thị loading khi đang tìm product

2. **Modal Preview**:
   - Size: medium (600px)
   - Hiển thị đầy đủ thông tin product
   - Button OK nổi bật

3. **Feedback**:
   - Success message khi thêm product thành công
   - Error message khi có lỗi
   - Loading state khi đang search

## Performance

- Scanner cleanup khi không dùng
- Debounce scan results để tránh duplicate calls
- Cache product data nếu có thể

## Security

- Validate barcode format trước khi gọi API
- Sanitize scan result
- Handle malicious QR codes

