import { Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { DropDownWithFilterOption } from '../../../components/common/DropDownWithFilter'
import type { GenericPageConfig } from '../../../components/GenericCRUD/GenericPage'
import { categoryApiService } from '../../categories/api'
import type { CategoryEntity } from '../../categories/types/entity'
import { supplierApiService } from '../../suppliers/api'
import type { SupplierEntity } from '../../suppliers/types/entity'
import type { CreateProductRequest, UpdateProductRequest } from '../types/api'
import type { ProductEntity } from '../types/entity'

export async function fetchCategoryOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
    const paged = await categoryApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((c: CategoryEntity) => ({ label: c.categoryName ?? `#${c.id}`, value: c.id }))
}

export async function fetchSupplierOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
    const paged = await supplierApiService.getPaginated({
        search: keyword || undefined,
        page: 1,
        pageSize: 20,
    })
    const items = paged.items ?? []
    return items.map((s: SupplierEntity) => ({ label: s.name ?? `#${s.id}`, value: s.id }))
}

export const productColumns: ColumnsType<ProductEntity> = [
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        sorter: true,
    },
    {
        title: 'Barcode',
        dataIndex: 'barcode',
        sorter: true,
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        sorter: true,
        render: (value: number) => `${value?.toLocaleString()} đ`,
    },
    {
        title: 'Đơn vị',
        dataIndex: 'unit',
    },
    {
        title: 'Danh mục',
        dataIndex: 'categoryId',
        render: (value: number | string | undefined, record: ProductEntity & { categoryName?: string }) => {
            const name = record?.categoryName
            if (name) return name
            if (typeof value === 'number') return <Tag color="blue">#{value}</Tag>
            if (typeof value === 'string') return value
            return '--'
        },
    },
    {
        title: 'Nhà cung cấp',
        dataIndex: 'supplierId',
        render: (value: number | string | undefined, record: ProductEntity & { supplierName?: string }) => {
            const name = record?.supplierName
            if (name) return name
            if (typeof value === 'number') return <Tag color="gold">#{value}</Tag>
            if (typeof value === 'string') return value
            return '--'
        },
    },
]

export const productPageConfig: GenericPageConfig<ProductEntity, CreateProductRequest, UpdateProductRequest> = {
    entity: {
        name: 'products',
        displayName: 'Sản phẩm',
        displayNamePlural: 'Sản phẩm',
    },
    table: {
        columns: productColumns,
        rowKey: 'id',
    },
    form: {
        create: [
            {
                name: 'productName',
                label: 'Tên sản phẩm',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập tên sản phẩm' }],
            },
            {
                name: 'barcode',
                label: 'Barcode',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập barcode' }],
            },
            {
                name: 'price',
                label: 'Giá',
                type: 'number',
                rules: [{ required: true, message: 'Vui lòng nhập giá' }],
            },
            {
                name: 'unit',
                label: 'Đơn vị',
                type: 'text',
                rules: [{ required: true, message: 'Vui lòng nhập đơn vị' }],
            },
            {
                name: 'categoryId',
                label: 'Danh mục',
                type: 'remote-select',
                rules: [{ required: true, message: 'Vui lòng chọn danh mục' }],
                placeholder: 'Chọn danh mục',
                fetchOptions: fetchCategoryOptions,
                queryKeyPrefix: 'category-select',
                fetchOnEmpty: true,
            },
            {
                name: 'supplierId',
                label: 'Nhà cung cấp',
                type: 'remote-select',
                rules: [{ required: true, message: 'Vui lòng chọn nhà cung cấp' }],
                placeholder: 'Chọn nhà cung cấp',
                fetchOptions: fetchSupplierOptions,
                queryKeyPrefix: 'supplier-select',
                fetchOnEmpty: true,
            },
        ],
        update: [
            {
                name: 'productName',
                label: 'Tên sản phẩm',
                type: 'text',
            },
            {
                name: 'barcode',
                label: 'Barcode',
                type: 'text',
            },
            {
                name: 'price',
                label: 'Giá',
                type: 'number',
            },
            {
                name: 'unit',
                label: 'Đơn vị',
                type: 'text',
            },
            {
                name: 'categoryId',
                label: 'Danh mục',
                type: 'remote-select',
                placeholder: 'Chọn danh mục',
                fetchOptions: fetchCategoryOptions,
                queryKeyPrefix: 'category-select',
                fetchOnEmpty: true,
            },
            {
                name: 'supplierId',
                label: 'Nhà cung cấp',
                type: 'remote-select',
                placeholder: 'Chọn nhà cung cấp',
                fetchOptions: fetchSupplierOptions,
                queryKeyPrefix: 'supplier-select',
                fetchOnEmpty: true,
            },
        ],
        getCreateInitialValues: () => ({}),
        getUpdateInitialValues: (record) => ({
            productName: record.productName,
            barcode: record.barcode,
            price: record.price,
            unit: record.unit,
            categoryId: record.categoryId,
            supplierId: record.supplierId,
            imageUrl: record.imageUrl,
            imageFileId: record.imageFileId,
        }),
        mapUpdatePayload: (values) => {
            const payload: UpdateProductRequest = {}
            if (values.productName !== undefined && values.productName !== '') {
                payload.productName = values.productName
            }
            if (values.barcode !== undefined && values.barcode !== '') {
                payload.barcode = values.barcode
            }
            if (values.price !== undefined && values.price !== null) {
                payload.price = values.price
            }
            if (values.unit !== undefined && values.unit !== '') {
                payload.unit = values.unit
            }
            if (values.categoryId !== undefined && values.categoryId !== null) {
                payload.categoryId = values.categoryId
            }
            if (values.supplierId !== undefined && values.supplierId !== null) {
                payload.supplierId = values.supplierId
            }
            if (values.imageUrl !== undefined) {
                payload.imageUrl = values.imageUrl
            }
            if (values.imageFileId !== undefined) {
                payload.imageFileId = values.imageFileId
            }
            return payload
        },
    },
    features: {
        enableCreate: true,
        enableEdit: true,
        enableDelete: true,
    },
}

