import { useState } from 'react'
import { Form, message } from 'antd'
import { getRouteApi, useNavigate, useRouter } from '@tanstack/react-router'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
import type { UserSearch } from '../../../app/routes/modules/management/definition/users.definition'
import { useCreateUser, useUpdateUser, useDeleteUser } from './useUsers'
import type { UserNoPass } from '../types/entity'

export const useUserManagementPage = () => {
    // Route API với search params trên URL
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.USERS)
    const { users: usersData, total: totalUsers } = routeApi.useLoaderData() || { users: [], total: 0 }
    const search = routeApi.useSearch()
    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.USERS })
    const router = useRouter()

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<UserNoPass | null>(null)
    const [deletingUser, setDeletingUser] = useState<UserNoPass | null>(null)
    const [form] = Form.useForm()

    // Mutation hooks
    const createUser = useCreateUser({
        onSuccess: () => {
            message.success('Thêm người dùng thành công!')
            form.resetFields()
            setIsModalVisible(false)
            setEditingUser(null)
            // Refetch route loader data
            router.invalidate()
        },
        onError: (error: Error) => {
            message.error(error.message || 'Không thể tạo người dùng mới')
        },
    })

    const updateUser = useUpdateUser({
        onSuccess: () => {
            message.success('Cập nhật người dùng thành công!')
            form.resetFields()
            setIsModalVisible(false)
            setEditingUser(null)
            // Refetch route loader data
            router.invalidate()
        },
        onError: (error: Error) => {
            message.error(error.message || 'Không thể cập nhật người dùng')
        },
    })

    const deleteUser = useDeleteUser({
        onSuccess: () => {
            message.success('Xóa người dùng thành công!')
            setIsDeleteModalVisible(false)
            setDeletingUser(null)
            // Refetch route loader data
            router.invalidate()
        },
        onError: (error: Error) => {
            message.error(error.message || 'Không thể xóa người dùng')
        },
    })

    // Search/Filter/Sort đọc từ URL (TanStack Router Query)
    const searchText = search?.search || ''
    const roleFilter = (search as UserSearch | undefined)?.role
    const sortField = (search as UserSearch | undefined)?.sortField || 'createdAt'
    const sortOrder = (search as UserSearch | undefined)?.sortOrder || 'descend'

    const showModal = () => {
        setEditingUser(null)
        setIsModalVisible(true)
        // Reset form completely
        setTimeout(() => {
            form.resetFields()
        }, 0)
    }

    const showEditModal = (user: UserNoPass) => {
        setEditingUser(user)
        setIsModalVisible(true)
        form.setFieldsValue(user)
    }

    const showDeleteModal = (user: UserNoPass) => {
        setDeletingUser(user)
        setIsDeleteModalVisible(true)
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            console.log('Form Values: ', values)

            if (editingUser) {
                // Update user
                updateUser.mutate({ id: editingUser.id, data: values })
            } else {
                // Add new user
                createUser.mutate(values)
            }
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'errorFields' in error) {
                // Form validation errors
                console.log('Validate Failed:', error)
            } else {
                // API errors - đã được handle trong onError của mutation hooks
                console.error('API Error:', error)
            }
        }
    }

    const handleDelete = async () => {
        if (deletingUser) {
            deleteUser.mutate(deletingUser.id)
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        setEditingUser(null)
        form.resetFields()
    }

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false)
        setDeletingUser(null)
    }

    // Search, Filter, Sort handlers (giống Mock page)
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
        totalUsers: totalUsers ?? users.length,
        adminCount,
        staffCount,

        // Modal states
        isModalVisible,
        isDeleteModalVisible,
        editingUser,
        deletingUser,
        form,

        // Search/Filter states
        searchText,
        roleFilter,
        sortField,
        sortOrder,

        // Handlers
        showModal,
        showEditModal,
        showDeleteModal,
        handleOk,
        handleDelete,
        handleCancel,
        handleDeleteCancel,
        handleSearch,
        handleRoleFilter,
        handleSort,
        clearFilters,
    }
}
