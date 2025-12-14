import { Modal, Descriptions, Table, Space, Typography, Divider, Tag } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { userApiService } from '../api/UserApiService'
import { orderApiService } from '../../orders/api/OrderApiService'
import { orderColumns } from '../../orders/config/orderPageConfig'
import type { UserDetailsDto } from '../types/entity'
import type { OrderEntity } from '../../orders/types/entity'
import { API_CONFIG } from '../../../config/api.config'
import { createQueryKeys } from '../../../lib/query/queryOptionsFactory'

const { Title, Text } = Typography

interface UserDetailModalProps {
    userId: number | null
    open: boolean
    onClose: () => void
}

export function UserDetailModal({ userId, open, onClose }: UserDetailModalProps) {
    // Sử dụng query key pattern giống với createQueryKeys để đảm bảo invalidate đúng
    const userQueryKeys = createQueryKeys('users')
    const orderQueryKeys = createQueryKeys('orders')
    
    // Fetch user details
    const { data: userDetails, isLoading: isLoadingUser } = useQuery<UserDetailsDto>({
        queryKey: userQueryKeys.detail(userId!),
        queryFn: () => userApiService.getUserDetails(userId!),
        enabled: open && userId !== null,
    })

    // Fetch orders của user
    const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
        queryKey: [...orderQueryKeys.list(), 'user', userId],
        queryFn: () => orderApiService.getPaginated({
            userId: userId!,
            page: 1,
            pageSize: 100, // Lấy tất cả orders của user (có thể paginate sau nếu cần)
        }),
        enabled: open && userId !== null,
    })

    const orders = ordersData?.items || []
    const isLoading = isLoadingUser || isLoadingOrders

    const getRoleLabel = (role: number) => {
        return role === API_CONFIG.USER_ROLES.ADMIN ? 'Quản trị viên' : 'Nhân viên'
    }

    const getRoleColor = (role: number) => {
        return role === API_CONFIG.USER_ROLES.ADMIN ? 'red' : 'blue'
    }

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết người dùng #{userId}</Title>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
            destroyOnClose
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>
            ) : userDetails ? (
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Thông tin người dùng */}
                    <Descriptions title="Thông tin người dùng" bordered column={2}>
                        <Descriptions.Item label="Mã người dùng">
                            <Text strong>#{userDetails.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên đăng nhập">
                            <Text strong>{userDetails.username}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ và tên">
                            {userDetails.fullName || '--'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vai trò">
                            <Tag color={getRoleColor(userDetails.role)}>
                                {getRoleLabel(userDetails.role)}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {userDetails.createdAt
                                ? new Date(userDetails.createdAt).toLocaleString('vi-VN')
                                : '--'}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Thống kê */}
                    <Descriptions title="Thống kê" bordered column={1}>
                        <Descriptions.Item label="Tổng số đơn hàng đã tạo">
                            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                {userDetails.totalOrders}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    {/* Danh sách đơn hàng */}
                    <div>
                        <Title level={5}>Danh sách đơn hàng đã tạo</Title>
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
                                Người dùng chưa tạo đơn hàng nào
                            </div>
                        )}
                    </div>
                </Space>
            ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Không tìm thấy thông tin người dùng
                </div>
            )}
        </Modal>
    )
}

