import { message } from 'antd'
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
import type { UserSearch } from '../../../app/routes/modules/management/definition/users.definition'
import { useCreateUser, useUpdateUser, useDeleteUser } from './useUsers'
import type { UserNoPass } from '../types/entity'

export const useUserManagementPage = () => {
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.USERS)
    const { users: usersData, total: totalUsers } = routeApi.useLoaderData() || { users: [], total: 0 }
    const search = routeApi.useSearch()
    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.USERS })
    const router = useRouter()

    const createUser = useCreateUser({
        onSuccess: (data) => {
            console.log('✅ [CreateUser] Success:', data)
            router.invalidate()
        },
        onError: (error: Error) => {
            console.error('❌ [CreateUser] Error:', error)
            message.error(error.message || 'Không thể tạo người dùng mới')
        },
    })

    const updateUser = useUpdateUser({
        onSuccess: (data) => {
            console.log('✅ [UpdateUser] Success:', data)
            router.invalidate()
        },
        onError: (error: Error) => {
            console.error('❌ [UpdateUser] Error:', error)
            message.error(error.message || 'Không thể cập nhật người dùng')
        },
    })

    const deleteUser = useDeleteUser({
        onSuccess: () => {
            router.invalidate()
        },
        onError: (error: Error) => {
            console.error('❌ [DeleteUser] Error:', error)
            message.error(error.message || 'Không thể xóa người dùng')
        },
    })

    const searchText = search?.search || ''
    const roleFilter = (search as UserSearch | undefined)?.role
    const sortField = (search as UserSearch | undefined)?.sortField || 'createdAt'
    const sortOrder = (search as UserSearch | undefined)?.sortOrder || 'descend'
    const page = (search as UserSearch | undefined)?.page || 1
    const pageSize = (search as UserSearch | undefined)?.pageSize || 10

    const handleSearch = (value: string) => {
        navigate({
            search: (prev: UserSearch) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleRoleFilter = (value: number | undefined) => {
        navigate({
            search: (prev: UserSearch) => ({
                ...prev,
                role: value,
                page: 1,
            }),
        })
    }

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        navigate({
            search: (prev: UserSearch) => ({
                ...prev,
                page: nextPage,
                pageSize: nextPageSize,
            }),
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: UserSearch) => ({
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
                role: undefined,
                sortField: 'createdAt',
                sortOrder: 'descend',
            },
        })
    }

    // Statistics (tính từ API data - đã được filter/sort ở backend)
    const users: UserNoPass[] = usersData || []
    const adminCount = users.filter((user: UserNoPass) => user.role === 0).length
    const staffCount = users.filter((user: UserNoPass) => user.role === 1).length

    return {
        // Data
        users,
        totalUsers,
        adminCount,
        staffCount,

        // Search/Filter states
        searchText,
        roleFilter,
        sortField,
        sortOrder,
        page,
        pageSize,

        // Handlers
        handleSearch,
        handleRoleFilter,
        handleSort,
        handlePageChange,
        clearFilters,

        // Mutations
        createUser,
        updateUser,
        deleteUser,
    }
}
