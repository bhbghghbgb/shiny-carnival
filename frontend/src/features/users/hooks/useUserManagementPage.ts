import { useState } from 'react'
import { Form, message } from 'antd'
import { userApi } from '../api/userApi'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { ENDPOINTS } from '../../../app/routes/type/endpoint'
import type { UserSearch } from '../../../app/routes/modules/management/definition/users.definition'

export const useUserManagementPage = () => {
    // Route API với search params trên URL
    const routeApi = getRouteApi(ENDPOINTS.ADMIN.USERS)
    const { users: usersData, total: totalUsers } = routeApi.useLoaderData() || { users: [], total: 0 }
    const search = routeApi.useSearch()
    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.USERS })

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [deletingUser, setDeletingUser] = useState<any>(null)
    const [form] = Form.useForm()

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

    const showEditModal = (user: any) => {
        setEditingUser(user)
        setIsModalVisible(true)
        form.setFieldsValue(user)
    }

    const showDeleteModal = (user: any) => {
        setDeletingUser(user)
        setIsDeleteModalVisible(true)
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            console.log('Form Values: ', values)

            if (editingUser) {
                // Update user
                const response = await userApi.updateUser(
                    editingUser.id,
                    values
                )
                if (!response.isError && response.data) {
                    message.success('Cập nhật người dùng thành công!')
                    // Refresh data by navigating to current page
                    navigate({ search: (prev) => ({ ...prev }) })
                } else {
                    message.error(
                        response.message || 'Không thể cập nhật người dùng'
                    )
                }
            } else {
                // Add new user
                const response = await userApi.createUser(values)
                if (!response.isError && response.data) {
                    message.success('Thêm người dùng thành công!')
                    // Refresh data by navigating to current page
                    navigate({ search: (prev) => ({ ...prev }) })
                } else {
                    message.error(
                        response.message || 'Không thể tạo người dùng mới'
                    )
                }
            }
            form.resetFields()
            setIsModalVisible(false)
        } catch (error: any) {
            if (error.errorFields) {
                // Form validation errors
                console.log('Validate Failed:', error)
            } else {
                // API errors
                message.error(error.message || 'Có lỗi xảy ra')
                console.error('API Error:', error)
            }
        }
    }

    const handleDelete = async () => {
        if (deletingUser) {
            try {
                const response = await userApi.deleteUser(deletingUser.id)
                if (!response.isError && response.data) {
                    message.success('Xóa người dùng thành công!')
                    // Refresh data by navigating to current page
                    navigate({ search: (prev) => ({ ...prev }) })
                    setIsDeleteModalVisible(false)
                    setDeletingUser(null)
                } else {
                    message.error(
                        response.message || 'Không thể xóa người dùng'
                    )
                }
            } catch (error: any) {
                message.error(
                    error.message || 'Có lỗi xảy ra khi xóa người dùng'
                )
                console.error('Delete error:', error)
            }
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

    // Statistics (tính từ API data)
    const users = usersData || []
    const adminCount = users.filter((user: any) => user.role === 0).length
    const staffCount = users.filter((user: any) => user.role === 1).length

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
