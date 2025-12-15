import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { ENDPOINTS } from '../../../app/routes/type/routes.endpoint'
import type { CategorySearch } from '../../../app/routes/modules/management/definition/categories.definition'
import { createCategoriesQueryOptions } from '../../../app/routes/modules/management/definition/categories.definition'
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategories'
import type { CategoryEntity } from '../types/entity'
import type { CreateCategoryRequest, UpdateCategoryRequest } from '../types/api'
import { parseApiError } from '../../../lib/api/utils/parseApiError'

export const useCategoryManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.CATEGORIES)
    const search = routeApi.useSearch() as CategorySearch

    const categoriesQueryOptions = createCategoriesQueryOptions(search)
    const { data: pagedList } = useSuspenseQuery(categoriesQueryOptions)

    const categories: CategoryEntity[] = pagedList.items || []
    const total = pagedList.totalCount || categories.length

    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.CATEGORIES })
    const router = useRouter()

    const [pageErrorMessage, setPageErrorMessage] = useState<string | null>(null)
    const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

    const createCategory = useCreateCategory({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Tạo danh mục thất bại: ${parseApiError(error)}`)
        },
    })

    const updateCategory = useUpdateCategory({
        onSuccess: () => {
            router.invalidate()
            setFormErrorMessage(null)
        },
        onError: (error: Error) => {
            setFormErrorMessage(`Cập nhật danh mục thất bại: ${parseApiError(error)}`)
        },
    })

    const deleteCategory = useDeleteCategory({
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
                setPageErrorMessage(`Xóa danh mục thất bại: ${errorMessage}`)
            }
        },
    })

    const searchText = search?.search || ''
    const sortField = search?.sortField || 'id'
    const sortOrder = search?.sortOrder || 'descend'
    const page = search?.page || 1
    const pageSize = search?.pageSize || 10

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: CategorySearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: CategorySearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: CategorySearch) => ({
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

    const handleCreate = async (values: CreateCategoryRequest) => {
        await createCategory.mutateAsync(values)
    }

    const handleUpdate = async (record: CategoryEntity, values: UpdateCategoryRequest) => {
        await updateCategory.mutateAsync({ id: record.id, data: values })
    }

    const handleDelete = (record: CategoryEntity) => deleteCategory.mutateAsync(record.id)

    return {
        categories,
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

        createCategory,
        updateCategory,
        deleteCategory,
        pageErrorMessage,
        formErrorMessage,
        clearPageError: () => setPageErrorMessage(null),
        clearFormError: () => setFormErrorMessage(null),
    }
}

