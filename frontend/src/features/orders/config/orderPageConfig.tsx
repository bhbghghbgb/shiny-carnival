import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { OrderEntity } from '../types/entity'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'
import { Tag } from 'antd'
import { API_CONFIG } from '../../../config/api.config'

const columns: ColumnsType<OrderEntity> = [
    {
        title: 'Mã đơn hàng',
        dataIndex: 'id',
        sorter: true,
    },
    {
        title: 'Ngày đặt',
        dataIndex: 'orderDate',
        sorter: true,
        render: (value: string) => value ? new Date(value).toLocaleString('vi-VN') : '--',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (status: string) => {
            const colorMap: Record<string, string> = {
                [API_CONFIG.ORDER_STATUS.PENDING]: 'orange',
                [API_CONFIG.ORDER_STATUS.PAID]: 'green',
                [API_CONFIG.ORDER_STATUS.CANCELED]: 'red',
            }
            const labelMap: Record<string, string> = {
                [API_CONFIG.ORDER_STATUS.PENDING]: 'Đang chờ',
                [API_CONFIG.ORDER_STATUS.PAID]: 'Đã thanh toán',
                [API_CONFIG.ORDER_STATUS.CANCELED]: 'Đã hủy',
            }
            return <Tag color={colorMap[status] || 'default'}>{labelMap[status] || status}</Tag>
        },
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'totalAmount',
        sorter: true,
        render: (value: number) => `${value?.toLocaleString()} đ`,
    },
    {
        title: 'Giảm giá',
        dataIndex: 'discountAmount',
        render: (value: number) => `${value?.toLocaleString()} đ`,
    },
]

export const orderPageConfig: GenericPageConfig<OrderEntity, CreateOrderRequest, UpdateOrderStatusRequest> = {
    entity: {
        name: 'orders',
        displayName: 'Đơn hàng',
        displayNamePlural: 'Đơn hàng',
    },
    table: {
        columns,
        rowKey: 'id',
    },
    form: {
        create: [
            {
                name: 'customerId',
                label: 'Khách hàng',
                type: 'number',
                rules: [{ required: true, message: 'Vui lòng chọn khách hàng' }],
                placeholder: 'ID khách hàng',
            },
            {
                name: 'promoCode',
                label: 'Mã khuyến mãi',
                type: 'text',
                placeholder: 'Mã khuyến mãi (tùy chọn)',
            },
        ],
        update: [
            {
                name: 'status',
                label: 'Trạng thái',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn trạng thái' }],
                options: [
                    { label: 'Đang chờ', value: API_CONFIG.ORDER_STATUS.PENDING },
                    { label: 'Đã thanh toán', value: API_CONFIG.ORDER_STATUS.PAID },
                    { label: 'Đã hủy', value: API_CONFIG.ORDER_STATUS.CANCELED },
                ],
            },
        ],
        getCreateInitialValues: () => ({}),
        getUpdateInitialValues: (record) => ({
            status: record.status,
        }),
        mapUpdatePayload: (values, record) => ({
            ...values,
            id: record.id,
        }),
    },
    features: {
        enableCreate: true,
        enableEdit: true,
        enableDelete: false, // Orders không có delete
    },
}

