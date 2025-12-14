import { useState } from 'react'
import { Card, message } from 'antd'
import { CreateOrderForm } from '../components/CreateOrderForm'
import { orderApiService } from '../api/OrderApiService'
import type { CreateOrderRequest } from '../types/api'

export function StaffOrderPage() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (values: CreateOrderRequest) => {
        try {
            setLoading(true)
            setErrorMessage(null)
            await orderApiService.create(values)
            message.success('Tạo đơn hàng thành công!')
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi tạo đơn hàng'
            setErrorMessage(errorMsg)
            message.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        // Không cần làm gì vì đây là trang, không phải modal
        // Có thể thêm logic navigate nếu cần
    }

    const handleClearError = () => {
        setErrorMessage(null)
    }

    return (
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
    )
}

