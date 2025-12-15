import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { PromotionSearch } from '../../../app/routes/modules/management/definition/promotions.definition'
import { createPromotionsQueryOptions } from '../../../app/routes/modules/management/definition/promotions.definition'
import { useCreatePromotion, useUpdatePromotion, useDeletePromotion } from './usePromotions'
import type { PromotionEntity } from '../types/entity'
import type { CreatePromotionRequest, UpdatePromotionRequest } from '../types/api'
import { parseApiError } from '../../../lib/api/utils/parseApiError'
import { promotionApiService } from '../api/PromotionApiService'

export const usePromotionManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.PROMOTIONS)
    const search = routeApi.useSearch() as PromotionSearch

    const promotionsQueryOptions = createPromotionsQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(promotionsQueryOptions)

    // Fetch active promotion count from API
    const { data: activePromotionCount } = useSuspenseQuery<number>({
        queryKey: ['promotions', 'active-count'],
        queryFn: () => promotionApiService.getActivePromotionCount(),
    })

    const promotions: PromotionEntity[] = pagedList.items || []
    const total = pagedList.totalCount || promotions.length

    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.PROMOTIONS })
    const router = useRouter()
    const queryClient = useQueryClient()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const createPromotion = useCreatePromotion({
        onSuccess: () => {
            router.invalidate()
            // Invalidate active-count query after creating promotion
            queryClient.invalidateQueries({ queryKey: ['promotions', 'active-count'] })
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Tạo khuyến mãi thất bại: ${parseApiError(error)}`)
        },
    })

    const updatePromotion = useUpdatePromotion({
        onSuccess: () => {
            router.invalidate()
            // Invalidate active-count query after updating promotion
            queryClient.invalidateQueries({ queryKey: ['promotions', 'active-count'] })
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật khuyến mãi thất bại: ${parseApiError(error)}`)
        },
    })

    const deletePromotion = useDeletePromotion({
        onSuccess: () => {
            router.invalidate()
            // Invalidate active-count query after deleting promotion
            queryClient.invalidateQueries({ queryKey: ['promotions', 'active-count'] })
            setPageErrorMessage(null)
        },
        onError: (error: Error) => {
            setPageErrorMessage(`Xóa khuyến mãi thất bại: ${parseApiError(error)}`)
        },
    })

    const searchText = search?.search || ''
    const sortField = search?.sortField || 'id'
    const sortOrder = search?.sortOrder || 'descend'
    const status = search?.status
    const page = search?.page || 1
    const pageSize = search?.pageSize || 10

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: PromotionSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleStatusChange = (value: 'active' | 'inactive' | undefined) => {
        navigate({
            search: (prev: PromotionSearch) => ({
                ...prev,
                status: value,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: PromotionSearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: PromotionSearch) => ({
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
                status: undefined,
            },
        })
    }

    const handleCreate = async (values: CreatePromotionRequest) => {
        await createPromotion.mutateAsync(values)
    }

    const handleUpdate = async (record: PromotionEntity, values: UpdatePromotionRequest) => {
        await updatePromotion.mutateAsync({ id: record.id, data: values })
    }

    const handleDelete = (record: PromotionEntity) => deletePromotion.mutateAsync(record.id)

    return {
        promotions,
        total,
        activePromotionCount: activePromotionCount ?? 0,

        searchText,
        sortField,
        sortOrder,
        status,
        page,
        pageSize,

        handleSearch,
        handleSort,
        handleStatusChange,
        handlePageChange,
        clearFilters,

        handleCreate,
        handleUpdate,
        handleDelete,

        createPromotion,
        updatePromotion,
        deletePromotion,
        pageErrorMessage,
        formErrorMessage,
        clearPageError: () => setPageErrorMessage(null),
        clearFormError: () => setFormErrorMessage(null),
    }
}

