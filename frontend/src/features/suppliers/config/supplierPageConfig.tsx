import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { SupplierEntity } from '../types/entity'
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types/api'

const columns: ColumnsType<SupplierEntity> = [
    {
        title: 'Tên nhà cung cấp',
        dataIndex: 'name',
        sorter: true,
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phone',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
    },
]

export const supplierPageConfig: GenericPageConfig<SupplierEntity, CreateSupplierRequest, UpdateSupplierRequest> = {
    entity: {
        name: 'suppliers',
        displayName: 'Nhà cung cấp',
        displayNamePlural: 'Nhà cung cấp',
    },
    table: {
        columns,
        rowKey: 'id',
    },
    form: {
        create: [
            {
                name: 'name',
                label: 'Tên nhà cung cấp',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }],
                placeholder: 'Nhập tên nhà cung cấp',
            },
            {
                name: 'phone',
                label: 'Số điện thoại',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập số điện thoại' }],
                placeholder: 'Nhập số điện thoại',
            },
            {
                name: 'email',
                label: 'Email',
                type: 'text',
                rules: [{ type: 'email', message: 'Email không hợp lệ' }],
                placeholder: 'Nhập email (tùy chọn)',
            },
            {
                name: 'address',
                label: 'Địa chỉ',
                type: 'text',
                placeholder: 'Nhập địa chỉ (tùy chọn)',
            },
        ],
        update: [
            {
                name: 'name',
                label: 'Tên nhà cung cấp',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }],
                placeholder: 'Nhập tên nhà cung cấp',
            },
            {
                name: 'phone',
                label: 'Số điện thoại',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập số điện thoại' }],
                placeholder: 'Nhập số điện thoại',
            },
            {
                name: 'email',
                label: 'Email',
                type: 'text',
                rules: [{ type: 'email', message: 'Email không hợp lệ' }],
                placeholder: 'Nhập email (tùy chọn)',
            },
            {
                name: 'address',
                label: 'Địa chỉ',
                type: 'text',
                placeholder: 'Nhập địa chỉ (tùy chọn)',
            },
        ],
        getCreateInitialValues: () => ({}),
        getUpdateInitialValues: (record) => ({
            name: record.name,
            phone: record.phone,
            email: record.email,
            address: record.address,
        }),
        mapUpdatePayload: (values, record) => ({
            ...values,
            id: record.id,
        }),
    },
    features: {
        enableCreate: true,
        enableEdit: true,
        enableDelete: true,
    },
}

