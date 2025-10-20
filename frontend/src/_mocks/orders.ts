export const orders = [
  {
    id: 1,
    customerId: 1,
    userId: 2,
    promoId: 1,
    orderDate: '2025-10-20T12:00:00Z',
    status: 'paid',
    totalAmount: 1550.50,
    discountAmount: 25.00,
    orderItems: [
      {
        orderItemId: 1,
        productId: 1,
        productName: 'Laptop Pro 15 inch',
        quantity: 1,
        price: 1500.00,
        subtotal: 1500.00,
      },
      {
        orderItemId: 2,
        productId: 2,
        productName: 'Gaming Mouse RGB',
        quantity: 1,
        price: 75.50,
        subtotal: 75.50,
      },
    ],
  },
  {
    id: 2,
    customerId: 2,
    userId: 3,
    promoId: null,
    orderDate: '2025-10-20T13:00:00Z',
    status: 'pending',
    totalAmount: 50.00,
    discountAmount: 0,
    orderItems: [
      {
        orderItemId: 3,
        productId: 3,
        productName: 'Áo thun Cotton cao cấp',
        quantity: 2,
        price: 25.00,
        subtotal: 50.00,
      },
    ],
  },
];

