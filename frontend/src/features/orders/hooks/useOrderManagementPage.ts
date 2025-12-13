import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { OrderSearch } from '../../../app/routes/modules/management/definition/orders.definition'
import { createOrdersQueryOptions } from '../../../app/routes/modules/management/definition/orders.definition'
import { useCreateOrder, useUpdateOrderStatus } from './useOrders'
import type { OrderEntity } from '../types/entity'
import type { CreateOrderRequest, UpdateOrderStatusRequest } from '../types/api'
import type { OrderStatus } from '../../../config/api.config'
import { parseApiError } from '../../../lib/api/utils/parseApiError'
import { orderApiService } from '../api/OrderApiService'

export const useOrderManagementPage = () => {
    // TanStack Router typing yêu cầu literal path, cast để đơn giản hóa
    const ORDER_ROUTE = ENDPOINTS.ADMIN.ORDERS.LIST as '/admin/orders'
    const routeApi = getRouteApi(ORDER_ROUTE as any)
    const search = routeApi.useSearch() as OrderSearch

    const ordersQueryOptions = createOrdersQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(ordersQueryOptions)

    const orders: OrderEntity[] = pagedList.items || []
    const total = pagedList.totalCount || orders.length

    // Fetch total revenue from API với cùng filters như orders (không bao gồm pagination params)
    const { data: totalRevenue } = useSuspenseQuery<number>({
        queryKey: ['orders', 'total-revenue', {
            status: search?.status,
            customerId: search?.customerId,
            userId: search?.userId,
            startDate: search?.startDate,
            endDate: search?.endDate,
            search: search?.search,
        }],
        queryFn: () => orderApiService.getTotalRevenue({
            status: search?.status,
            customerId: search?.customerId,
            userId: search?.userId,
            startDate: search?.startDate,
            endDate: search?.endDate,
            search: search?.search,
        }),
    })

    const navigate = useNavigate({ from: ORDER_ROUTE as any })
    const router = useRouter()
    const queryClient = useQueryClient()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const createOrder = useCreateOrder({
        onSuccess: () => {
            router.invalidate()
            // Invalidate total revenue query khi có order mới
            queryClient.invalidateQueries({ queryKey: ['orders', 'total-revenue'] })
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Tạo đơn hàng thất bại: ${parseApiError(error)}`)
        },
    })

    const updateOrderStatus = useUpdateOrderStatus({
        onSuccess: () => {
            // Invalidate orders list query với exact queryKey từ current search
            queryClient.invalidateQueries({ 
                queryKey: ordersQueryOptions.queryKey 
            })
            // Invalidate total revenue query khi status thay đổi (có thể ảnh hưởng đến doanh thu)
            queryClient.invalidateQueries({ queryKey: ['orders', 'total-revenue'] })
            // Invalidate router loader để trigger refetch
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật trạng thái đơn hàng thất bại: ${parseApiError(error)}`)
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
            search: ((prev: OrderSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            })) as any,
        })
    }

    const handleStatusFilter = (value?: OrderStatus) => {
        navigate({
            search: ((prev: OrderSearch) => ({
                ...prev,
                status: value,
                page: 1,
            })) as any,
        })
    }

    const handleCustomerFilter = (value?: number) => {
        navigate({
            search: ((prev: OrderSearch) => ({
                ...prev,
                customerId: value,
                page: 1,
            })) as any,
        })
    }

    const handleUserFilter = (value?: number) => {
        navigate({
            search: ((prev: OrderSearch) => ({
                ...prev,
                userId: value,
                page: 1,
            })) as any,
        })
    }

    const handleDateRangeChange = (start?: string, end?: string) => {
        navigate({
            search: ((prev: OrderSearch) => ({
                ...prev,
                startDate: start,
                endDate: end,
                page: 1,
            })) as any,
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: ((prev: OrderSearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            })) as any,
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: ((prev: OrderSearch) => ({
                ...prev,
                sortField: field,
                sortOrder: order,
            })) as any,
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
            } as any,
        })
    }

    const handleCreate = async (values: CreateOrderRequest) => {
        await createOrder.mutateAsync(values)
    }

    const handleUpdate = async (record: OrderEntity, values: UpdateOrderStatusRequest) => {
        await updateOrderStatus.mutateAsync({ id: record.id, data: values })
    }

    return {
        orders,
        total,
        totalRevenue: totalRevenue ?? 0,

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

