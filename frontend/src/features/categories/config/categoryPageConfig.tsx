import type { ColumnsType } from 'antd/es/table'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import type { CategoryEntity } from '../types/entity'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types/api'

const columns: ColumnsType<CategoryEntity> = [
    {
        title: 'Tên danh mục',
        dataIndex: 'categoryName',
        sorter: true,
    },
]

export const categoryPageConfig: GenericPageConfig<CategoryEntity, CreateCategoryRequest, UpdateCategoryRequest> = {
    entity: {
        name: 'categories',
        displayName: 'Danh mục',
        displayNamePlural: 'Danh mục',
    },
    table: {
        columns,
        rowKey: 'id',
    },
    form: {
        create: [
            {
                name: 'categoryName',
                label: 'Tên danh mục',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập tên danh mục' }],
                placeholder: 'Nhập tên danh mục',
            },
        ],
        update: [
            {
                name: 'categoryName',
                label: 'Tên danh mục',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập tên danh mục' }],
                placeholder: 'Nhập tên danh mục',
            },
        ],
        getCreateInitialValues: () => ({}),
        getUpdateInitialValues: (record) => ({
            categoryName: record.categoryName,
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

