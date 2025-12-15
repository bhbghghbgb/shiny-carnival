import { useQuery } from '@tanstack/react-query'
import { Button, Descriptions, Divider, Modal, Space, Table, Tag, Typography } from 'antd'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { API_CONFIG } from '../../../config/api.config'
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory'
import { orderApiService } from '../api/OrderApiService'
import type { OrderDetailsDto, OrderItemEntity } from '../types/entity'

const { Title, Text } = Typography

interface PaymentConfirmationModalProps {
    orderId: number | null
    open: boolean
    onClose: () => void
    onConfirmPayment: (orderId: number) => Promise<void>
    isConfirming?: boolean
    onPrintPdfReady?: (printFn: () => Promise<void>) => void
}

export function PaymentConfirmationModal({
    orderId,
    open,
    onClose,
    onConfirmPayment,
    isConfirming = false,
    onPrintPdfReady,
}: PaymentConfirmationModalProps) {
    const queryKeys = createQueryKeys('orders')

    const { data: orderDetails, isLoading } = useQuery<OrderDetailsDto>({
        queryKey: queryKeys.detail(orderId!),
        queryFn: () => orderApiService.getOrderDetails(orderId!),
        enabled: open && orderId !== null,
    })

    const orderItemsColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Mã vạch',
            dataIndex: 'barcode',
            key: 'barcode',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right' as const,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            align: 'right' as const,
            render: (value: number) => `${value?.toLocaleString()} đ`,
        },
        {
            title: 'Thành tiền',
            dataIndex: 'subtotal',
            key: 'subtotal',
            align: 'right' as const,
            render: (value: number) => <strong>{value?.toLocaleString()} đ</strong>,
        },
    ]

    const getStatusColor = (status: string) => {
        const colorMap: Record<string, string> = {
            [API_CONFIG.ORDER_STATUS.PENDING]: 'orange',
            [API_CONFIG.ORDER_STATUS.PAID]: 'green',
            [API_CONFIG.ORDER_STATUS.CANCELED]: 'red',
        }
        return colorMap[status] || 'default'
    }

    const getStatusLabel = (status: string) => {
        const labelMap: Record<string, string> = {
            [API_CONFIG.ORDER_STATUS.PENDING]: 'Đang chờ',
            [API_CONFIG.ORDER_STATUS.PAID]: 'Đã thanh toán',
            [API_CONFIG.ORDER_STATUS.CANCELED]: 'Đã hủy',
        }
        return labelMap[status] || status
    }

    // Expose printPDF function to parent component
    const printPDF = async () => {
        if (!orderId) return
        
        const input = document.getElementById('order-detail-pdf')
        if (!input) return

        const pdf = new jsPDF('p', 'mm', 'a4')

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const contentWidth = pageWidth - 15 * 2
        const contentHeight = pageHeight

        const drawHeader = () => {
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            pdf.text('CHI TIET DON HANG #' + orderId, pageWidth / 2, 20, { align: 'center' })
            pdf.setLineWidth(0.3)
            pdf.line(15, 35, pageWidth - 15, 35)
        }

        const canvas = await html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        const imgHeight = (canvas.height * contentWidth) / canvas.width
        let heightLeft = imgHeight
        let position = 20

        drawHeader()
        pdf.addImage(imgData, 'JPEG', 15, position, contentWidth, imgHeight)

        heightLeft -= contentHeight
        while (heightLeft > 0) {
            pdf.addPage()
            position = 20 - (imgHeight - heightLeft)
            pdf.addImage(imgData, 'JPEG', 15, position, contentWidth, imgHeight)
            heightLeft -= contentHeight
        }
        pdf.save(`don-hang-${orderId}.pdf`)
    }

    // Expose printPDF to parent when modal opens
    if (open && onPrintPdfReady && orderId) {
        onPrintPdfReady(printPDF)
    }

    const handleConfirmPayment = async () => {
        if (!orderId) return
        try {
            await onConfirmPayment(orderId)
        } catch (error) {
            // Error handling được xử lý ở parent component
            console.error('Error confirming payment:', error)
        }
    }

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Xác nhận thanh toán đơn hàng #{orderId}</Title>}
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={isConfirming}>
                    Đóng
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    loading={isConfirming}
                    onClick={handleConfirmPayment}
                    disabled={orderDetails?.status === API_CONFIG.ORDER_STATUS.PAID}
                >
                    Xác nhận thanh toán
                </Button>,
            ]}
            width={900}
            destroyOnClose
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
            ) : orderDetails ? (
                <div id="order-detail-pdf">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Thông tin đơn hàng */}
                    <Descriptions title="Thông tin đơn hàng" bordered column={2}>
                        <Descriptions.Item label="Mã đơn hàng">
                            <Text strong>#{orderDetails.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt">
                            {orderDetails.orderDate
                                ? new Date(orderDetails.orderDate).toLocaleString('vi-VN')
                                : '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={getStatusColor(orderDetails.status)}>
                                {getStatusLabel(orderDetails.status)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhân viên">
                            {orderDetails.staffName || '--'}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Thông tin khách hàng */}
                    <Descriptions title="Thông tin khách hàng" bordered column={2}>
                        <Descriptions.Item label="Tên khách hàng">
                            {orderDetails.customerName || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {orderDetails.customerPhone || '--'}
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Mã khuyến mãi */}
                    {orderDetails.promoCode && (
                        <Descriptions title="Khuyến mãi" bordered column={1}>
                            <Descriptions.Item label="Mã khuyến mãi">
                                <Tag color="blue">{orderDetails.promoCode}</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    )}

                    {/* Chi tiết sản phẩm */}
                    <div>
                        <Title level={5}>Chi tiết sản phẩm</Title>
                        <Table<OrderItemEntity>
                            columns={orderItemsColumns}
                            dataSource={orderDetails.orderItems || []}
                            rowKey="orderItemId"
                            pagination={false}
                            size="small"
                        />
                    </div>

                    <Divider />

                    {/* Tổng kết */}
                    <Descriptions title="Tổng kết" bordered column={1}>
                        <Descriptions.Item label="Tổng tiền">
                            <Text>{orderDetails.totalAmount?.toLocaleString()} đ</Text>
                        </Descriptions.Item>
                        {orderDetails.discountAmount > 0 && (
                            <Descriptions.Item label="Giảm giá">
                                <Text type="success">
                                    -{orderDetails.discountAmount?.toLocaleString()} đ
                                </Text>
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label="Thành tiền">
                            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                                {orderDetails.finalAmount?.toLocaleString()} đ
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    {/* Thông báo nếu đã thanh toán */}
                    {orderDetails.status === API_CONFIG.ORDER_STATUS.PAID && (
                        <div style={{ textAlign: 'center', padding: '16px', background: '#f6ffed', borderRadius: '4px' }}>
                            <Text type="success" strong>
                                Đơn hàng đã được thanh toán
                            </Text>
                        </div>
                    )}
                </Space>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Không tìm thấy thông tin đơn hàng
                </div>
            )}
        </Modal>
    )
}

