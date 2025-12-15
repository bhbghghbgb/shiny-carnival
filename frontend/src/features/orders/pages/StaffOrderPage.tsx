import { useState } from 'react'
import { Card, message } from 'antd'
import { CreateOrderForm } from '../components/CreateOrderForm'
import { PaymentConfirmationModal } from '../components/PaymentConfirmationModal'
import { orderApiService } from '../api/OrderApiService'
import { useUpdateOrderStatus } from '../hooks/useOrders'
import { API_CONFIG } from '../../../config/api.config'
import type { CreateOrderRequest } from '../types/api'

export function StaffOrderPage() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null)

    const updateOrderStatus = useUpdateOrderStatus({
        onSuccess: () => {
            message.success('Xác nhận thanh toán thành công!')
            setPaymentModalOpen(false)
            setCreatedOrderId(null)
        },
        onError: (error: Error) => {
            const errorMsg = (error as any)?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xác nhận thanh toán'
            message.error(errorMsg)
        },
    })

    const handleSubmit = async (values: CreateOrderRequest) => {
        try {
            setLoading(true)
            setErrorMessage(null)
            const createdOrder = await orderApiService.create(values)
            message.success('Tạo đơn hàng thành công!')
            // Lưu orderId và mở modal xác nhận thanh toán
            setCreatedOrderId(createdOrder.id)
            setPaymentModalOpen(true)
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tạo đơn hàng'
            setErrorMessage(errorMsg)
            message.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmPayment = async (orderId: number) => {
        await updateOrderStatus.mutateAsync({
            id: orderId,
            data: {
                status: API_CONFIG.ORDER_STATUS.PAID,
            },
        })
    }

    const handleCancel = () => {
        // Không cần làm gì vì đây là trang, không phải modal
        // Có thể thêm logic navigate nếu cần
    }

    const handleClearError = () => {
        setErrorMessage(null)
    }

    return (
        <>
            <div style={{ padding: '24px' }}>
                <Card title="Tạo đơn hàng mới" style={{ minHeight: '500px' }}>
                    <CreateOrderForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={loading}
                        errorMessage={errorMessage}
                        onClearError={handleClearError}
                    />
                </Card>
            </div>

            <PaymentConfirmationModal
                orderId={createdOrderId}
                open={paymentModalOpen}
                onClose={() => {
                    setPaymentModalOpen(false)
                    setCreatedOrderId(null)
                }}
                onConfirmPayment={handleConfirmPayment}
                isConfirming={updateOrderStatus.isPending}
            />
        </>
    )
}

