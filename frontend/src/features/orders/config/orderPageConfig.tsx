import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { OrderEntity } from '../types/entity'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'
import type { DropDownWithFilterOption } from '../../../components/common/DropDownWithFilter'
import { Tag, Button, Space } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { API_CONFIG } from '../../../config/api.config'
import { customerApiService } from '../../customers/api/CustomerApiService'
import type { CustomerEntity } from '../../customers/types/entity'
import { productApiService } from '../../products/api/ProductApiService'
import type { ProductEntity } from '../../products/types/entity'

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
        render: (value: number) => value > 0 ? `-${value?.toLocaleString()} đ` : '0 đ',
    },
    {
        title: 'Thành tiền',
        dataIndex: 'finalAmount',
        sorter: true,
        render: (value: number, record: OrderEntity) => {
            // Nếu có finalAmount từ backend thì dùng, nếu không thì tính: totalAmount - discountAmount
            const finalAmount = value ?? (record.totalAmount - record.discountAmount);
            return <strong style={{ color: '#1890ff' }}>{finalAmount?.toLocaleString()} đ</strong>;
        },
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
                type: 'remote-select',
                rules: [{ required: true, message: 'Vui lòng chọn khách hàng' }],
                placeholder: 'Chọn khách hàng',
                fetchOptions: async (keyword: string): Promise<DropDownWithFilterOption[]> => {
                    const paged = await customerApiService.getPaginated({
                        search: keyword || undefined,
                        page: 1,
                        pageSize: 20,
                    })
                    const items = paged.items ?? []
                    return items.map((c: CustomerEntity) => ({ 
                        label: c.name ?? `#${c.id}`, 
                        value: c.id 
                    }))
                },
                queryKeyPrefix: 'customer-order-select',
                fetchOnEmpty: true,
            },
            {
                name: 'productId',
                label: 'Sản phẩm',
                type: 'remote-select',
                rules: [{ required: true, message: 'Vui lòng chọn sản phẩm' }],
                placeholder: 'Chọn sản phẩm',
                fetchOptions: async (keyword: string): Promise<DropDownWithFilterOption[]> => {
                    const paged = await productApiService.getPaginated({
                        search: keyword || undefined,
                        page: 1,
                        pageSize: 20,
                    })
                    const items = paged.items ?? []
                    return items.map((p: ProductEntity) => ({ 
                        label: `${p.productName ?? `#${p.id}`} - ${p.price?.toLocaleString()} đ`, 
                        value: p.id 
                    }))
                },
                queryKeyPrefix: 'product-order-select',
                fetchOnEmpty: true,
            },
            {
                name: 'quantity',
                label: 'Số lượng',
                type: 'number',
                rules: [
                    { required: true, message: 'Vui lòng nhập số lượng' },
                    { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' }
                ],
                placeholder: 'Nhập số lượng',
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
        getCreateInitialValues: () => ({
            quantity: 1,
        }),
        mapCreatePayload: (values: any): CreateOrderRequest => {
            // Transform form values to CreateOrderRequest
            const { customerId, productId, quantity, promoCode } = values
            return {
                customerId: customerId as number,
                promoCode: promoCode || undefined,
                orderItems: [
                    {
                        productId: productId as number,
                        quantity: quantity as number,
                    }
                ]
            }
        },
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

