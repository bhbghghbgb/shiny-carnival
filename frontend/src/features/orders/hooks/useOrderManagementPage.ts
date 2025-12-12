import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { OrderSearch } from '../../../app/routes/modules/management/definition/orders.definition'
import { createOrdersQueryOptions } from '../../../app/routes/modules/management/definition/orders.definition'
import { useCreateOrder, useUpdateOrderStatus } from './useOrders'
import type { OrderEntity } from '../types/entity'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'
import type { OrderStatus } from '../../../config/api.config'

export const useOrderManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.ORDERS.LIST)
    const search = routeApi.useSearch() as OrderSearch

    const ordersQueryOptions = createOrdersQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(ordersQueryOptions)

    const orders: OrderEntity[] = pagedList.items || []
    const total = pagedList.totalCount || orders.length

    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.ORDERS.LIST })
    const router = useRouter()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const parseErrorMessage = (error: unknown) => {
        if (error instanceof Error) return error.message
        if (typeof error === 'string') return error
        return 'Đã có lỗi xảy ra, vui lòng thử lại.'
    }

    const createOrder = useCreateOrder({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Tạo đơn hàng thất bại: ${parseErrorMessage(error)}`)
        },
    })

    const updateOrderStatus = useUpdateOrderStatus({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật trạng thái đơn hàng thất bại: ${parseErrorMessage(error)}`)
        },
    })

    const searchText = search?.search || ''
    const statusFilter = search?.status
    const customerId = search?.customerId
    const userId = search?.userId
    const startDate = search?.startDate
    const endDate = search?.endDate
    const sortField = search?.sortField || 'id'
    const sortOrder = search?.sortOrder || 'descend'
    const page = search?.page || 1
    const pageSize = search?.pageSize || 10

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: OrderSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleStatusFilter = (value?: OrderStatus) => {
        navigate({
            search: (prev: OrderSearch) => ({
                ...prev,
                status: value,
                page: 1,
            }),
        })
    }

    const handleCustomerFilter = (value?: number) => {
        navigate({
            search: (prev: OrderSearch) => ({
                ...prev,
                customerId: value,
                page: 1,
            }),
        })
    }

    const handleUserFilter = (value?: number) => {
        navigate({
            search: (prev: OrderSearch) => ({
                ...prev,
                userId: value,
                page: 1,
            }),
        })
    }

    const handleDateRangeChange = (start?: string, end?: string) => {
        navigate({
            search: (prev: OrderSearch) => ({
                ...prev,
                startDate: start,
                endDate: end,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: OrderSearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: OrderSearch) => ({
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
                status: undefined,
                customerId: undefined,
                userId: undefined,
                startDate: undefined,
                endDate: undefined,
                sortField: 'id',
                sortOrder: 'descend',
            },
        })
    }

    const handleCreate = async (values: CreateOrderRequest) => {
        await createOrder.mutateAsync(values)
    }

    const handleUpdate = async (record: OrderEntity, values: UpdateOrderStatusRequest) => {
        await updateOrderStatus.mutateAsync({ ...values, id: record.id })
    }

    return {
        orders,
        total,

        searchText,
        statusFilter,
        customerId,
        userId,
        startDate,
        endDate,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleStatusFilter,
        handleCustomerFilter,
        handleUserFilter,
        handleDateRangeChange,
        handleSort,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete: undefined, // Orders không có delete

        createOrder,
        updateOrderStatus,
        pageErrorMessage,
        formErrorMessage,
        clearPageError: () => setPageErrorMessage(null),
        clearFormError: () => setFormErrorMessage(null),
    }
}

