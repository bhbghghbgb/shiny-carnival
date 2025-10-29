export const promotions = [
  {
    id: 1,
    promoCode: 'SALE25',
    description: 'Giảm giá 25 đồng cho đơn hàng đầu tiên',
    discountType: 'fixed',
    discountValue: 25.00,
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-10-31T23:59:59Z',
    minOrderAmount: 100.00,
    usageLimit: 100,
    usedCount: 42,
    status: 'active',
  },
  {
    id: 2,
    promoCode: 'FREESHIP',
    description: 'Miễn phí vận chuyển cho đơn hàng trên 500 đồng',
    discountType: 'fixed',
    discountValue: 15.00, // Giả sử phí ship cố định là 15
    startDate: '2025-10-15T00:00:00Z',
    endDate: '2025-11-15T23:59:59Z',
    minOrderAmount: 500.00,
    usageLimit: 500,
    usedCount: 123,
    status: 'active',
  },
];

