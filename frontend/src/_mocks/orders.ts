// Mutable mock orders for development. In real API mode, this file is replaced by server calls.
export const orders = [
    {
        id: 1,
        customerId: 1,
        userId: 2,
        promoId: 1,
        orderDate: '2025-10-20T12:00:00Z',
        status: 'paid',
        totalAmount: 1550.5,
        discountAmount: 25.0,
        orderItems: [
            {
                orderItemId: 1,
                productId: 1,
                productName: 'Laptop Pro 15 inch',
                quantity: 1,
                price: 1500.0,
                subtotal: 1500.0,
            },
            {
                orderItemId: 2,
                productId: 2,
                productName: 'Gaming Mouse RGB',
                quantity: 1,
                price: 75.5,
                subtotal: 75.5,
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
        totalAmount: 50.0,
        discountAmount: 0,
        orderItems: [
            {
                orderItemId: 3,
                productId: 3,
                productName: 'Áo thun Cotton cao cấp',
                quantity: 2,
                price: 25.0,
                subtotal: 50.0,
            },
        ],
    },
]

// Helpers to mutate mock data (development only)
export function addMockOrder(order: any) {
    // naive id generation
    const nextId = orders.reduce((m, o) => Math.max(m, o.id), 0) + 1
    const newOrder = {
        id: nextId,
        orderDate: new Date().toISOString(),
        status: 'pending',
        discountAmount: 0,
        promoId: null,
        ...order,
    }
    orders.push(newOrder)
    return newOrder
}

export function updateMockOrderStatus(id: number, status: string) {
    const target = orders.find((o) => o.id === id)
    if (target) {
        target.status = status
        return target
    }
    return null
}
