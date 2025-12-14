# Files to Modify/Create

## Files to Create

### 1. `src/features/orders/components/QRCodeScanner.tsx`
**Purpose**: React component wrapper for html5-qrcode scanner
**Size**: ~150 lines
**Dependencies**: 
- html5-qrcode
- react
- antd (Button for close)

### 2. `src/features/orders/components/ProductPreviewModal.tsx`
**Purpose**: Modal to preview and confirm scanned product
**Size**: ~100 lines
**Dependencies**:
- antd (Modal, Descriptions, Button, Typography)
- react

## Files to Modify

### 1. `src/features/orders/components/CreateOrderForm.tsx`
**Changes**:
- Import QRCodeScanner and ProductPreviewModal
- Add state: `isScanning`, `scannedProduct`, `isPreviewModalOpen`, `isSearchingProduct`
- Add handlers: `handleScanClick`, `handleScanSuccess`, `handleConfirmProduct`, `handleCancelScan`
- Add "Scan" button in Card "Thêm sản phẩm"
- Conditional render QRCodeScanner when `isScanning = true`
- Render ProductPreviewModal when `isPreviewModalOpen = true`
- Import `QrcodeOutlined` icon from @ant-design/icons

**Lines to modify**: ~50 lines added

### 2. `package.json`
**Changes**:
- Add dependency: `"html5-qrcode": "^2.3.8"`

**Lines to modify**: 1 line added

## File Structure After Changes

```
src/features/orders/
├── components/
│   ├── CreateOrderForm.tsx (MODIFIED)
│   ├── QRCodeScanner.tsx (NEW)
│   ├── ProductPreviewModal.tsx (NEW)
│   ├── OrderDetailModal.tsx (existing)
│   ├── OrderHeader.tsx (existing)
│   ├── OrderSearchFilter.tsx (existing)
│   └── OrderStatistics.tsx (existing)
├── pages/
│   └── StaffOrderPage.tsx (existing)
├── store/
│   └── orderStore.ts (existing - no changes needed)
└── api/
    └── OrderApiService.ts (existing - no changes needed)
```

## Dependencies Summary

### New Dependencies
- `html5-qrcode@^2.3.8` - QR code scanner library

### Existing Dependencies (already in package.json)
- `react` - Framework
- `antd` - UI components
- `zustand` - State management
- `@ant-design/icons` - Icons

## Type Definitions

html5-qrcode includes TypeScript definitions, no additional @types package needed.

