import { Modal, Descriptions, Table, Space, Typography, Divider } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { customerApiService } from '../api/CustomerApiService'
import { orderApiService } from '../../orders/api/OrderApiService'
import { orderColumns } from '../../orders/config/orderPageConfig'
import type { CustomerDetailsDto } from '../types/entity'
import type { OrderEntity } from '../../orders/types/entity'
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory'

const { Title, Text } = Typography

interface CustomerDetailModalProps {
    customerId: number | null
    open: boolean
    onClose: () => void
}

export function CustomerDetailModal({ customerId, open, onClose }: CustomerDetailModalProps) {
    // Sử dụng query key pattern giống với createQueryKeys để đảm bảo invalidate đúng
    const customerQueryKeys = createQueryKeys('customers')
    const orderQueryKeys = createQueryKeys('orders')
    
    // Fetch customer details
    const { data: customerDetails, isLoading: isLoadingCustomer } = useQuery<CustomerDetailsDto>({
        queryKey: customerQueryKeys.detail(customerId!),
        queryFn: () => customerApiService.getCustomerDetails(customerId!),
        enabled: open && customerId !== null,
    })

    // Fetch orders của customer
    const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
        queryKey: [...orderQueryKeys.list(), 'customer', customerId],
        queryFn: () => orderApiService.getPaginated({
            customerId: customerId!,
            page: 1,
            pageSize: 100, // Lấy tất cả orders của customer (có thể paginate sau nếu cần)
        }),
        enabled: open && customerId !== null,
    })

    const orders = ordersData?.items || []
    const isLoading = isLoadingCustomer || isLoadingOrders

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết khách hàng #{customerId}</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
            destroyOnClose
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
            ) : customerDetails ? (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Thông tin khách hàng */}
                    <Descriptions title="Thông tin khách hàng" bordered column={2}>
                        <Descriptions.Item label="Mã khách hàng">
                            <Text strong>#{customerDetails.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên khách hàng">
                            <Text strong>{customerDetails.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {customerDetails.phone || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {customerDetails.email || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={2}>
                            {customerDetails.address || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {customerDetails.createdAt
                                ? new Date(customerDetails.createdAt).toLocaleString('vi-VN')
                                : '--'}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Thống kê */}
                    <Descriptions title="Thống kê" bordered column={2}>
                        <Descriptions.Item label="Tổng số đơn hàng">
                            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                {customerDetails.totalOrders}
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tổng chi tiêu">
                            <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                                {customerDetails.totalSpent?.toLocaleString('vi-VN')} đ
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Danh sách đơn hàng */}
                    <div>
                        <Title level={5}>Danh sách đơn hàng</Title>
                        {orders.length > 0 ? (
                            <Table<OrderEntity>
                                columns={orderColumns}
                                dataSource={orders}
                                rowKey="id"
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showTotal: (total) => `Tổng ${total} đơn hàng`,
                                }}
                                size="small"
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                Khách hàng chưa có đơn hàng nào
                            </div>
                        )}
                    </div>
                </Space>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Không tìm thấy thông tin khách hàng
                </div>
            )}
        </Modal>
    )
}

