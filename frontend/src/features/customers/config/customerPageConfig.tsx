import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { CustomerEntity } from '../types/entity'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/api'

export const customerColumns: ColumnsType<CustomerEntity> = [
    {
        title: 'Tên khách hàng',
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

export const customerPageConfig: GenericPageConfig<CustomerEntity, CreateCustomerRequest, UpdateCustomerRequest> = {
    entity: {
        name: 'customers',
        displayName: 'Khách hàng',
        displayNamePlural: 'Khách hàng',
    },
    table: {
        columns: customerColumns,
        rowKey: 'id',
    },
    form: {
        create: [
            {
                name: 'name',
                label: 'Tên khách hàng',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập tên khách hàng' }],
                placeholder: 'Nhập tên khách hàng',
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
                label: 'Tên khách hàng',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập tên khách hàng' }],
                placeholder: 'Nhập tên khách hàng',
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
        mapUpdatePayload: (values) => values,
    },
    features: {
        enableCreate: true,
        enableEdit: true,
        enableDelete: true,
    },
}

