import {
    orders,
    addMockOrder,
    updateMockOrderStatus,
} from '../../../_mocks/orders'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'

// Mock service, sau khi có API của BE sẽ gọi tới axios instance
// Simulate API call
const getOrders = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(orders)
        }, 500) // Simulate network delay
    })
}

const createOrder = (orderData: CreateOrderRequest) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newOrder = addMockOrder(orderData)
            resolve(newOrder)
        }, 500)
    })
}

const updateOrderStatus = (
    id: number,
    statusData: UpdateOrderStatusRequest
) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const updated = updateMockOrderStatus(id, statusData.status)
            resolve(updated)
        }, 500)
    })
}

const deleteOrder = (id: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = orders.findIndex((o) => o.id === id)
            if (index > -1) {
                orders.splice(index, 1)
            }
            resolve(true)
        }, 500)
    })
}

export const orderService = {
    getOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
}
