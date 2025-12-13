import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { PromotionEntity } from '../types/entity'
import type { CreatePromotionRequest, UpdatePromotionRequest } from '../types/api'
import { Tag } from 'antd'
import { API_CONFIG } from '../../../config/api.config'
import dayjs from 'dayjs'

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
                name: 'dateRange' as any,
                label: 'Khoảng thời gian',
                type: 'dateRange',
                rules: [{ required: true, message: 'Vui lòng chọn khoảng thời gian' }],
                placeholder: 'Ngày bắt đầu, Ngày kết thúc',
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
                name: 'dateRange' as any,
                label: 'Khoảng thời gian',
                type: 'dateRange',
                rules: [{ required: true, message: 'Vui lòng chọn khoảng thời gian' }],
                placeholder: 'Ngày bắt đầu, Ngày kết thúc',
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
            dateRange: record.startDate && record.endDate 
                ? [dayjs(record.startDate), dayjs(record.endDate)]
                : null,
            minOrderAmount: record.minOrderAmount,
            usageLimit: record.usageLimit,
            status: record.status,
        } as any),
        mapCreatePayload: (values: any) => {
            // Extract startDate and endDate from dateRange
            // According to swagger.json: startDate and endDate are required (format: date-time)
            const dateRange = values.dateRange as [any, any] | null | undefined
            if (!dateRange || !dateRange[0] || !dateRange[1]) {
                throw new Error('Vui lòng chọn khoảng thời gian')
            }
            const startDate = dateRange[0].toISOString()
            const endDate = dateRange[1].toISOString()
            
            // According to swagger.json:
            // - Required: discountType, discountValue, endDate, promoCode, startDate, status
            // - minOrderAmount: optional (minimum: 0)
            // - usageLimit: optional but has minimum: 1, maximum: 2147483647
            // - description: nullable, optional
            return {
                promoCode: values.promoCode,
                description: values.description || null,
                discountType: values.discountType,
                discountValue: Number(values.discountValue), // Ensure it's a number
                startDate,
                endDate,
                minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : 0,
                usageLimit: values.usageLimit ? Math.floor(Number(values.usageLimit)) : 1, // Ensure it's an integer (int32 per swagger)
                status: values.status,
            } as CreatePromotionRequest
        },
        mapUpdatePayload: (values: any) => {
            // Map to UpdatePromotionRequest format (camelCase)
            // Based on swagger.json: UpdatePromotionRequest does NOT include usedCount
            // Backend will automatically map camelCase to PascalCase properties via JSON serialization
            // Ensure dates are in ISO string format for .NET DateTime parsing
            // Extract startDate and endDate from dateRange
            // According to swagger.json: startDate and endDate are required (format: date-time)
            const dateRange = values.dateRange as [any, any] | null | undefined
            if (!dateRange || !dateRange[0] || !dateRange[1]) {
                throw new Error('Vui lòng chọn khoảng thời gian')
            }
            const startDate = dateRange[0].toISOString()
            const endDate = dateRange[1].toISOString()
            
            // According to swagger.json:
            // - Required: id, discountType, discountValue, endDate, promoCode, startDate, status
            // - minOrderAmount: optional (minimum: 0)
            // - usageLimit: optional but has minimum: 1, maximum: 2147483647
            // - description: nullable, optional
            return {
                promoCode: values.promoCode,
                description: values.description || null, // nullable according to swagger
                discountType: values.discountType,
                discountValue: values.discountValue,
                startDate,
                endDate,
                minOrderAmount: values.minOrderAmount || 0,
                usageLimit: values.usageLimit || 1, // Default to 1 if not provided (minimum per swagger)
                status: values.status,
            } as UpdatePromotionRequest
        },
    },
    features: {
        enableCreate: true,
        enableEdit: true,
        enableDelete: true,
    },
}

