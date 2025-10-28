import { useState } from 'react'
import { Form, message } from 'antd'
import { userApi } from '../api/userApi'
import { Route } from '../../../app/routes/users'

export const useUserManagementPage = () => {
    // Lấy dữ liệu và search params từ route context
    const { data: usersData } = (Route.useLoaderData() || {}) as any
    const { search } = (Route.useSearch() || {}) as any
    const navigate = Route.useNavigate()

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [deletingUser, setDeletingUser] = useState<any>(null)
    const [form] = Form.useForm()

    // Search, Filter, Sort states (giống Mock page)
    const [searchText, setSearchText] = useState(search || '')
    const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined)
    const [sortField, setSortField] = useState<string>('createdAt')
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend')

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
        setSearchText(value)
        navigate({
            search: (prev) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        })
    }

    const handleRoleFilter = (value: number | undefined) => {
        setRoleFilter(value)
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        setSortField(field)
        setSortOrder(order)
    }

    const clearFilters = () => {
        setSearchText('')
        setRoleFilter(undefined)
        setSortField('createdAt')
        setSortOrder('descend')
        navigate({
            search: (prev) => ({
                ...prev,
                search: undefined,
                page: 1,
            }),
        })
    }

    // Statistics (tính từ API data)
    const users = usersData?.items || []
    const adminCount = users.filter((user: any) => user.role === 0).length
    const staffCount = users.filter((user: any) => user.role === 1).length

    return {
        // Data
        users,
        totalUsers: users.length,
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
