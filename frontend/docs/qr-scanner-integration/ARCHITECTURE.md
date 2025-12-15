# QR Scanner Integration - Architecture

## Component Hierarchy

```
CreateOrderForm
├── Form (Ant Design)
│   ├── Customer Dropdown
│   ├── Card "Thêm sản phẩm"
│   │   ├── Product Dropdown
│   │   ├── Quantity Input
│   │   ├── Button "Thêm vào đơn hàng"
│   │   └── Button "Scan" (NEW)
│   └── Promo Code Input
└── Order Info Panel (Right side)
    ├── QRCodeScanner (NEW - conditional render)
    └── Order Items Table (existing)
        └── ProductPreviewModal (NEW - conditional render)
```

## State Management

### Local State (CreateOrderForm)
```typescript
- isScanning: boolean
- scannedProduct: ProductEntity | null
- isPreviewModalOpen: boolean
- isSearchingProduct: boolean
```

### Global State (orderStore)
```typescript
- draftOrder.orderItems: DraftOrderItem[]
- addDraftOrderItem(item): void
```

## Data Flow

### Scan Flow
```
1. User clicks "Scan" button
   → setIsScanning(true)
   → Render QRCodeScanner component

2. QRCodeScanner scans QR code
   → onScanSuccess(decodedText)
   → handleScanSuccess(decodedText)

3. handleScanSuccess:
   → setIsSearchingProduct(true)
   → productApiService.searchByBarcode(decodedText)
   → If found: setScannedProduct(product), setIsPreviewModalOpen(true)
   → If not found: show error message
   → setIsScanning(false) (pause scanner)

4. User clicks "OK" in ProductPreviewModal
   → handleConfirmProduct()
   → Create DraftOrderItem from product
   → useOrderStore.getState().addDraftOrderItem(item)
   → setIsPreviewModalOpen(false)
   → setScannedProduct(null)
   → Order info div auto-updates (subscribed to orderItems)

5. User clicks "Hủy" in ProductPreviewModal
   → setIsPreviewModalOpen(false)
   → setScannedProduct(null)
   → setIsScanning(true) (resume scanner)
```

## Component Interfaces

### QRCodeScanner
```typescript
interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose: () => void;
  visible: boolean;
}
```

### ProductPreviewModal
```typescript
interface ProductPreviewModalProps {
  product: ProductEntity | null;
  open: boolean;
  onConfirm: (product: ProductEntity) => void;
  onCancel: () => void;
  loading?: boolean;
}
```

## API Integration

### ProductApiService.searchByBarcode()
```typescript
async searchByBarcode(barcode: string): Promise<ProductEntity[]>
```
- Returns array of products matching barcode
- Uses `getAll({ search: barcode })` internally
- May return multiple products (handle first match)

## Store Integration

### orderStore.addDraftOrderItem()
```typescript
addDraftOrderItem: (item: DraftOrderItem) => void
```
- Adds item to draftOrder.orderItems
- Persists to localStorage automatically
- Triggers re-render in subscribed components

## Lifecycle Management

### QRCodeScanner Lifecycle
1. **Mount**: Initialize Html5QrcodeScanner
2. **Start**: Call scanner.render()
3. **Scan**: Handle onScanSuccess callback
4. **Pause**: Call scanner.clear() when modal opens
5. **Resume**: Re-render scanner if user cancels modal
6. **Unmount**: Call scanner.clear() and cleanup

### Modal Lifecycle
1. **Open**: When product found after scan
2. **Confirm**: Add to store, close modal, close scanner
3. **Cancel**: Close modal, resume scanner

## Error Boundaries

- Wrap QRCodeScanner in error boundary
- Handle camera permission errors
- Handle scanner initialization errors
- Graceful fallback UI

## Performance Optimizations

1. **Scanner**: 
   - Only initialize when visible
   - Cleanup on unmount
   - Pause when modal opens

2. **API Calls**:
   - Debounce scan results (avoid duplicate calls)
   - Cache product data if possible

3. **Re-renders**:
   - Use Zustand selectors to minimize re-renders
   - Memoize expensive computations

