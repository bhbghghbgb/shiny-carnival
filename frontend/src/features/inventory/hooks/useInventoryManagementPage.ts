import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { InventorySearch } from '../../../app/routes/modules/management/definition/inventory.definition'
import { createInventoriesQueryOptions } from '../../../app/routes/modules/management/definition/inventory.definition'
import { useUpdateInventory } from './useInventory'
import type { InventoryEntity } from '../types/inventoryEntity'
import type { UpdateInventoryRequest } from '../types/api'

export const useInventoryManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.INVENTORY.LIST)
    const search = routeApi.useSearch() as InventorySearch

    const inventoriesQueryOptions = createInventoriesQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(inventoriesQueryOptions)

    const inventories: InventoryEntity[] = pagedList.items || []
    const total = pagedList.totalCount || inventories.length

    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.INVENTORY.LIST })
    const router = useRouter()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const parseErrorMessage = (error: unknown) => {
        if (error instanceof Error) return error.message
        if (typeof error === 'string') return error
        return 'Đã có lỗi xảy ra, vui lòng thử lại.'
    }

    const updateInventory = useUpdateInventory({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật tồn kho thất bại: ${parseErrorMessage(error)}`)
        },
    })

    const searchText = search?.search || ''
    const productId = search?.productId
    const minQuantity = search?.minQuantity
    const maxQuantity = search?.maxQuantity
    const sortField = search?.sortField || 'id'
    const sortOrder = search?.sortOrder || 'descend'
    const page = search?.page || 1
    const pageSize = search?.pageSize || 10

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: InventorySearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleProductFilter = (value?: number) => {
        navigate({
            search: (prev: InventorySearch) => ({
                ...prev,
                productId: value,
                page: 1,
            }),
        })
    }

    const handleQuantityRangeChange = (nextMin?: number, nextMax?: number) => {
        navigate({
            search: (prev: InventorySearch) => ({
                ...prev,
                minQuantity: nextMin,
                maxQuantity: nextMax,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: InventorySearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: InventorySearch) => ({
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
                productId: undefined,
                minQuantity: undefined,
                maxQuantity: undefined,
                sortField: 'id',
                sortOrder: 'descend',
            },
        })
    }

    const handleUpdate = async (record: InventoryEntity, values: UpdateInventoryRequest) => {
        await updateInventory.mutateAsync({ id: record.productId, data: values })
    }

    return {
        inventories,
        total,

        searchText,
        productId,
        minQuantity,
        maxQuantity,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleProductFilter,
        handleQuantityRangeChange,
        handleSort,
        handlePageChange,
        clearFilters,

        handleUpdate,

        updateInventory,
        pageErrorMessage,
        formErrorMessage,
        clearPageError: () => setPageErrorMessage(null),
        clearFormError: () => setFormErrorMessage(null),
    }
}

