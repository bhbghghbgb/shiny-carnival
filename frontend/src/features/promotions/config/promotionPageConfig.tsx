import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { PromotionEntity } from '../types/entity'
import type { CreatePromotionRequest, UpdatePromotionRequest } from '../types/api'
import { Tag } from 'antd'
import { API_CONFIG } from '../../../config/api.config'

const columns: ColumnsType<PromotionEntity> = [
    {
        title: 'Mã khuyến mãi',
        dataIndex: 'promoCode',
        sorter: true,
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
    },
    {
        title: 'Loại giảm giá',
        dataIndex: 'discountType',
        render: (type: string) => {
            const labelMap: Record<string, string> = {
                [API_CONFIG.DISCOUNT_TYPES.PERCENT]: 'Phần trăm',
                [API_CONFIG.DISCOUNT_TYPES.FIXED]: 'Cố định',
            }
            return labelMap[type] || type
        },
    },
    {
        title: 'Giá trị giảm',
        dataIndex: 'discountValue',
        render: (value: number, record: PromotionEntity) => {
            if (record.discountType === API_CONFIG.DISCOUNT_TYPES.PERCENT) {
                return `${value}%`
            }
            return `${value.toLocaleString()} đ`
        },
    },
    {
        title: 'Ngày bắt đầu',
        dataIndex: 'startDate',
        render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : '--',
    },
    {
        title: 'Ngày kết thúc',
        dataIndex: 'endDate',
        render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : '--',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (status: string) => {
            const colorMap: Record<string, string> = {
                [API_CONFIG.PROMOTION_STATUS.ACTIVE]: 'green',
                [API_CONFIG.PROMOTION_STATUS.INACTIVE]: 'default',
            }
            const labelMap: Record<string, string> = {
                [API_CONFIG.PROMOTION_STATUS.ACTIVE]: 'Hoạt động',
                [API_CONFIG.PROMOTION_STATUS.INACTIVE]: 'Không hoạt động',
            }
            return <Tag color={colorMap[status] || 'default'}>{labelMap[status] || status}</Tag>
        },
    },
]

export const promotionPageConfig: GenericPageConfig<PromotionEntity, CreatePromotionRequest, UpdatePromotionRequest> = {
    entity: {
        name: 'promotions',
        displayName: 'Khuyến mãi',
        displayNamePlural: 'Khuyến mãi',
    },
    table: {
        columns,
        rowKey: 'id',
    },
    form: {
        create: [
            {
                name: 'promoCode',
                label: 'Mã khuyến mãi',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }],
                placeholder: 'Nhập mã khuyến mãi',
            },
            {
                name: 'description',
                label: 'Mô tả',
                type: 'text',
                placeholder: 'Nhập mô tả (tùy chọn)',
            },
            {
                name: 'discountType',
                label: 'Loại giảm giá',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn loại giảm giá' }],
                options: [
                    { label: 'Phần trăm', value: API_CONFIG.DISCOUNT_TYPES.PERCENT },
                    { label: 'Cố định', value: API_CONFIG.DISCOUNT_TYPES.FIXED },
                ],
            },
            {
                name: 'discountValue',
                label: 'Giá trị giảm',
                type: 'number',
                rules: [{ required: true, message: 'Vui lòng nhập giá trị giảm' }],
                placeholder: 'Nhập giá trị giảm',
            },
            {
                name: 'startDate',
                label: 'Ngày bắt đầu',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập ngày bắt đầu (ISO format)' }],
                placeholder: 'YYYY-MM-DDTHH:mm:ss',
            },
            {
                name: 'endDate',
                label: 'Ngày kết thúc',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập ngày kết thúc (ISO format)' }],
                placeholder: 'YYYY-MM-DDTHH:mm:ss',
            },
            {
                name: 'minOrderAmount',
                label: 'Giá trị đơn hàng tối thiểu',
                type: 'number',
                placeholder: 'Nhập giá trị tối thiểu (tùy chọn)',
            },
            {
                name: 'usageLimit',
                label: 'Giới hạn sử dụng',
                type: 'number',
                rules: [{ required: true, message: 'Vui lòng nhập giới hạn sử dụng' }],
                placeholder: 'Nhập giới hạn sử dụng',
            },
            {
                name: 'status',
                label: 'Trạng thái',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn trạng thái' }],
                options: [
                    { label: 'Hoạt động', value: API_CONFIG.PROMOTION_STATUS.ACTIVE },
                    { label: 'Không hoạt động', value: API_CONFIG.PROMOTION_STATUS.INACTIVE },
                ],
            },
        ],
        update: [
            {
                name: 'promoCode',
                label: 'Mã khuyến mãi',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }],
                placeholder: 'Nhập mã khuyến mãi',
            },
            {
                name: 'description',
                label: 'Mô tả',
                type: 'text',
                placeholder: 'Nhập mô tả (tùy chọn)',
            },
            {
                name: 'discountType',
                label: 'Loại giảm giá',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn loại giảm giá' }],
                options: [
                    { label: 'Phần trăm', value: API_CONFIG.DISCOUNT_TYPES.PERCENT },
                    { label: 'Cố định', value: API_CONFIG.DISCOUNT_TYPES.FIXED },
                ],
            },
            {
                name: 'discountValue',
                label: 'Giá trị giảm',
                type: 'number',
                rules: [{ required: true, message: 'Vui lòng nhập giá trị giảm' }],
                placeholder: 'Nhập giá trị giảm',
            },
            {
                name: 'startDate',
                label: 'Ngày bắt đầu',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập ngày bắt đầu (ISO format)' }],
                placeholder: 'YYYY-MM-DDTHH:mm:ss',
            },
            {
                name: 'endDate',
                label: 'Ngày kết thúc',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập ngày kết thúc (ISO format)' }],
                placeholder: 'YYYY-MM-DDTHH:mm:ss',
            },
            {
                name: 'minOrderAmount',
                label: 'Giá trị đơn hàng tối thiểu',
                type: 'number',
                placeholder: 'Nhập giá trị tối thiểu (tùy chọn)',
            },
            {
                name: 'usageLimit',
                label: 'Giới hạn sử dụng',
                type: 'number',
                rules: [{ required: true, message: 'Vui lòng nhập giới hạn sử dụng' }],
                placeholder: 'Nhập giới hạn sử dụng',
            },
            {
                name: 'status',
                label: 'Trạng thái',
                type: 'select',
                rules: [{ required: true, message: 'Vui lòng chọn trạng thái' }],
                options: [
                    { label: 'Hoạt động', value: API_CONFIG.PROMOTION_STATUS.ACTIVE },
                    { label: 'Không hoạt động', value: API_CONFIG.PROMOTION_STATUS.INACTIVE },
                ],
            },
        ],
        getCreateInitialValues: () => ({
            status: API_CONFIG.PROMOTION_STATUS.ACTIVE,
            discountType: API_CONFIG.DISCOUNT_TYPES.PERCENT,
            usageLimit: 100,
        }),
        getUpdateInitialValues: (record) => ({
            promoCode: record.promoCode,
            description: record.description,
            discountType: record.discountType,
            discountValue: record.discountValue,
            startDate: record.startDate,
            endDate: record.endDate,
            minOrderAmount: record.minOrderAmount,
            usageLimit: record.usageLimit,
            status: record.status,
        }),
        mapUpdatePayload: (values, record) => ({
            ...values,
            id: record.id,
            usedCount: record.usedCount,
        }),
    },
    features: {
        enableCreate: true,
        enableEdit: true,
        enableDelete: true,
    },
}

