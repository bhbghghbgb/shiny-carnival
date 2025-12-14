import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { ProductSearch } from '../../../app/routes/modules/management/definition/products.definition'
import { createProductsQueryOptions } from '../../../app/routes/modules/management/definition/products.definition'
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from './useProducts'
import { inventoryApiService } from '../../inventory/api/InventoryApiService'
import type { LowStockAlert } from '../../inventory/types/api'
import type { ProductEntity } from '../types/entity'
import type { CreateProductRequest, UpdateProductRequest } from '../types/api'
import { parseApiError } from '../../../lib/api/utils/parseApiError'

export const useProductManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.PRODUCTS)
    const search = routeApi.useSearch() as ProductSearch

    const productsQueryOptions = createProductsQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(productsQueryOptions)

    // Fetch low stock alerts from API
    const { data: lowStockAlerts } = useSuspenseQuery<LowStockAlert[]>({
        queryKey: ['inventory', 'low-stock'],
        queryFn: () => inventoryApiService.getLowStockAlerts(),
    })

    const products: ProductEntity[] = pagedList.items || []
    const total = pagedList.totalCount || products.length
    const lowStockCount = lowStockAlerts?.length ?? 0

    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.PRODUCTS })
    const router = useRouter()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const createProduct = useCreateProduct({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Tạo sản phẩm thất bại: ${parseApiError(error)}`)
        },
    })

    const updateProduct = useUpdateProduct({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật sản phẩm thất bại: ${parseApiError(error)}`)
        },
    })

    const deleteProduct = useDeleteProduct({
        onSuccess: () => {
            router.invalidate()
            setPageErrorMessage(null)
        },
        onError: (error: Error) => {
            const errorMessage = parseApiError(error)
            // Nếu message từ backend đã rõ ràng (có chứa "không thể xóa" hoặc "đang có"), dùng trực tiếp
            if (errorMessage.includes('không thể xóa') || errorMessage.includes('đang có')) {
                setPageErrorMessage(errorMessage)
            } else {
                setPageErrorMessage(`Xóa sản phẩm thất bại: ${errorMessage}`)
            }
        },
    })

    const searchText = search?.search || ''
    const sortField = search?.sortField || 'id'
    const sortOrder = search?.sortOrder || 'descend'
    const page = search?.page || 1
    const pageSize = search?.pageSize || 10
    const categoryId = search?.categoryId
    const supplierId = search?.supplierId
    const minPrice = search?.minPrice
    const maxPrice = search?.maxPrice
    const onlyLowStock = search?.onlyLowStock

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleCategoryFilter = (value?: number) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                categoryId: value,
                page: 1,
            }),
        })
    }

    const handleSupplierFilter = (value?: number) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                supplierId: value,
                page: 1,
            }),
        })
    }

    const handlePriceRangeChange = (nextMin?: number, nextMax?: number) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                minPrice: nextMin,
                maxPrice: nextMax,
                page: 1,
            }),
        })
    }

    const handleLowStockFilter = (checked: boolean) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                onlyLowStock: checked || undefined,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: ProductSearch) => ({
                ...prev,
                sortField: field,
                sortOrder: order,
            }),
        })
    }

    const clearFilters = () => {
        navigate({
            search: {
                page: 1,
                pageSize: 10,
                search: undefined,
                categoryId: undefined,
                supplierId: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                onlyLowStock: undefined,
                sortField: 'id',
                sortOrder: 'descend',
            },
        })
    }

    const handleCreate = async (values: CreateProductRequest) => {
        await createProduct.mutateAsync(values)
    }

    const handleUpdate = async (record: ProductEntity, values: UpdateProductRequest) => {
        await updateProduct.mutateAsync({ id: record.id, data: values })
    }

    const handleDelete = (record: ProductEntity) => deleteProduct.mutateAsync(record.id)

    return {
        products,
        total,
        lowStockCount,

        searchText,
        sortField,
        sortOrder,
        page,
        pageSize,
        categoryId,
        supplierId,
        minPrice,
        maxPrice,
        onlyLowStock,

        handleSearch,
        handleCategoryFilter,
        handleSupplierFilter,
        handlePriceRangeChange,
        handleLowStockFilter,
        handleSort,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createProduct,
        updateProduct,
        deleteProduct,
        pageErrorMessage,
        formErrorMessage,
        clearPageError: () => setPageErrorMessage(null),
        clearFormError: () => setFormErrorMessage(null),
    }
}


