// Simple event bus to notify order list changes when using mock data

const ORDERS_CHANGED_EVENT = 'orders:changed'

export const emitOrdersChanged = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(ORDERS_CHANGED_EVENT))
    }
}

export const onOrdersChanged = (handler: () => void) => {
    if (typeof window === 'undefined') return () => {}
    window.addEventListener(ORDERS_CHANGED_EVENT, handler)
    return () => window.removeEventListener(ORDERS_CHANGED_EVENT, handler)
}
