import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { InventoryEntity } from '../types/inventoryEntity'
import type { UpdateInventoryRequest } from '../types/api'

const columns: ColumnsType<InventoryEntity> = [
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        sorter: true,
    },
    {
        title: 'Mã vạch',
        dataIndex: 'barcode',
        sorter: true,
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        sorter: true,
        render: (value: number) => value?.toLocaleString(),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (value: string) => {
            const statusMap: Record<string, { label: string; color: string }> = {
                in_stock: { label: 'Còn hàng', color: 'green' },
                low_stock: { label: 'Sắp hết', color: 'orange' },
                out_of_stock: { label: 'Hết hàng', color: 'red' },
            }
            const status = statusMap[value] || { label: value, color: 'default' }
            return <span style={{ color: status.color, fontWeight: 'bold' }}>{status.label}</span>
        },
    },
    {
        title: 'Cập nhật lần cuối',
        dataIndex: 'updatedAt',
        render: (value: string) => value ? new Date(value).toLocaleString('vi-VN') : '--',
    },
]

export const inventoryPageConfig: GenericPageConfig<InventoryEntity, never, UpdateInventoryRequest> = {
    entity: {
        name: 'inventory',
        displayName: 'Tồn kho',
        displayNamePlural: 'Tồn kho',
    },
    table: {
        columns,
        rowKey: 'inventoryId',
    },
    form: {
        create: [], // Inventory không có create
        update: [
            {
                name: 'quantityChange',
                label: 'Thay đổi số lượng',
                type: 'number',
                rules: [{ required: true, message: 'Vui lòng nhập số lượng thay đổi' }],
                placeholder: 'Nhập số lượng (dương để tăng, âm để giảm)',
            },
            {
                name: 'reason',
                label: 'Lý do',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập lý do thay đổi' }],
                placeholder: 'Nhập lý do thay đổi tồn kho',
            },
        ],
        getCreateInitialValues: () => ({}),
        getUpdateInitialValues: () => ({
            quantityChange: 0,
            reason: '',
        }),
        mapUpdatePayload: (values) => values,
    },
    features: {
        enableCreate: false, // Inventory không có create
        enableEdit: true,
        enableDelete: false, // Inventory không có delete
    },
}

