import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { CustomerSearch } from '../../../app/routes/modules/management/definition/customers.definition'
import { createCustomersQueryOptions } from '../../../app/routes/modules/management/definition/customers.definition'
import { useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from './useCustomers'
import type { CustomerEntity } from '../types/entity'
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/api'

export const useCustomerManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.CUSTOMERS.LIST)
    const search = routeApi.useSearch() as CustomerSearch

    const customersQueryOptions = createCustomersQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(customersQueryOptions)

    const customers: CustomerEntity[] = pagedList.items || []
    const total = pagedList.totalCount || customers.length

    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.CUSTOMERS.LIST })
    const router = useRouter()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const parseErrorMessage = (error: unknown) => {
        if (error instanceof Error) return error.message
        if (typeof error === 'string') return error
        return 'Đã có lỗi xảy ra, vui lòng thử lại.'
    }

    const createCustomer = useCreateCustomer({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Tạo khách hàng thất bại: ${parseErrorMessage(error)}`)
        },
    })

    const updateCustomer = useUpdateCustomer({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật khách hàng thất bại: ${parseErrorMessage(error)}`)
        },
    })

    const deleteCustomer = useDeleteCustomer({
        onSuccess: () => {
            router.invalidate()
            setPageErrorMessage(null)
        },
        onError: (error: Error) => {
            setPageErrorMessage(`Xóa khách hàng thất bại: ${parseErrorMessage(error)}`)
        },
    })

    const searchText = search?.search || ''
    const sortField = search?.sortField || 'id'
    const sortOrder = search?.sortOrder || 'descend'
    const page = search?.page || 1
    const pageSize = search?.pageSize || 10

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: CustomerSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: CustomerSearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: CustomerSearch) => ({
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

    const handleCreate = async (values: CreateCustomerRequest) => {
        await createCustomer.mutateAsync(values)
    }

    const handleUpdate = async (record: CustomerEntity, values: UpdateCustomerRequest) => {
        await updateCustomer.mutateAsync({ ...values, id: record.id })
    }

    const handleDelete = (record: CustomerEntity) => deleteCustomer.mutateAsync(record.id)

    return {
        customers,
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

        createCustomer,
        updateCustomer,
        deleteCustomer,
        pageErrorMessage,
        formErrorMessage,
        clearPageError: () => setPageErrorMessage(null),
        clearFormError: () => setFormErrorMessage(null),
    }
}

