import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { SupplierSearch } from '../../../app/routes/modules/management/definition/suppliers.definition'
import { createSuppliersQueryOptions } from '../../../app/routes/modules/management/definition/suppliers.definition'
import { useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from './useSuppliers'
import type { SupplierEntity } from '../types/entity'
import type { CreateSupplierRequest, UpdateSupplierRequest } from '../types/api'
import { parseApiError } from '../../../lib/api/utils/parseApiError'

export const useSupplierManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.SUPPLIERS)
    const search = routeApi.useSearch() as SupplierSearch

    const suppliersQueryOptions = createSuppliersQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(suppliersQueryOptions)

    const suppliers: SupplierEntity[] = pagedList.items || []
    const total = pagedList.totalCount || suppliers.length

    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.SUPPLIERS })
    const router = useRouter()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const createSupplier = useCreateSupplier({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Tạo nhà cung cấp thất bại: ${parseApiError(error)}`)
        },
    })

    const updateSupplier = useUpdateSupplier({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật nhà cung cấp thất bại: ${parseApiError(error)}`)
        },
    })

    const deleteSupplier = useDeleteSupplier({
        onSuccess: () => {
            router.invalidate()
            setPageErrorMessage(null)
        },
        onError: (error: Error) => {
            setPageErrorMessage(`Xóa nhà cung cấp thất bại: ${parseApiError(error)}`)
        },
    })

    const searchText = search?.search || ''
    const sortField = search?.sortField || 'id'
    const sortOrder = search?.sortOrder || 'descend'
    const page = search?.page || 1
    const pageSize = search?.pageSize || 10

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: SupplierSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: SupplierSearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: SupplierSearch) => ({
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
                sortField: 'id',
                sortOrder: 'descend',
            },
        })
    }

    const handleCreate = async (values: CreateSupplierRequest) => {
        await createSupplier.mutateAsync(values)
    }

    const handleUpdate = async (record: SupplierEntity, values: UpdateSupplierRequest) => {
        await updateSupplier.mutateAsync({ ...values, id: record.id })
    }

    const handleDelete = (record: SupplierEntity) => deleteSupplier.mutateAsync(record.id)

    return {
        suppliers,
        total,

        searchText,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleSort,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createSupplier,
        updateSupplier,
        deleteSupplier,
        pageErrorMessage,
        formErrorMessage,
        clearPageError: () => setPageErrorMessage(null),
        clearFormError: () => setFormErrorMessage(null),
    }
}

