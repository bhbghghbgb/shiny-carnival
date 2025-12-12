import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { InventoryEntity } from '../types/inventoryEntity'
import type { UpdateInventoryRequest } from '../types/api'

const columns: ColumnsType<InventoryEntity> = [
    {
        title: 'Mã sản phẩm',
        dataIndex: 'productId',
        sorter: true,
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        sorter: true,
        render: (value: number) => value?.toLocaleString(),
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

