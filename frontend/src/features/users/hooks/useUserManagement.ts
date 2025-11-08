import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import type { UserEntity } from '../types/entity'
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { ENDPOINTS } from '../../../app/routes/type/endpoint';
import type { UserSearch } from '../../../app/routes/modules/management/definition/users.definition';

const routeApi = getRouteApi(ENDPOINTS.ADMIN.USERS);

export const useUserManagement = () => {
    const { users: initialUsers } = routeApi.useLoaderData()
    const navigate = useNavigate({ from: ENDPOINTS.ADMIN.USERS })

    // ✅ Sử dụng useSearch thay vì useState cho search/filter/sort dùng cho call api sau này
    const search = routeApi.useSearch()
    const searchText = search.search || ''
    const roleFilter = search.role
    const sortField = search.sortField || 'createdAt'
    const sortOrder = search.sortOrder || 'descend'

    const [users, setUsers] = useState(initialUsers)
    const [filteredUsers, setFilteredUsers] = useState<UserEntity[]>([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [editingUser, setEditingUser] = useState<UserEntity | null>(null)
    const [deletingUser, setDeletingUser] = useState<UserEntity | null>(null)
    const [form] = Form.useForm()

    // Reset form when editingUser changes
    useEffect(() => {
        if (isModalVisible) {
            if (editingUser) {
                form.setFieldsValue(editingUser)
            } else {
                form.resetFields()
            }
        }
    }, [editingUser, isModalVisible, form])

    // useEffect(() => {
    //     // Mock
    //     const fetchUsers = async () => {
    //         const data = (await userService.getUsers()) as UserEntity[]
    //         setUsers(data)
    //         setFilteredUsers(data)
    //         console.log('Users: ' + data)
    //     }
    //     fetchUsers()
    // }, [])

    // Filter and sort users when search, filter, or sort changes
    useEffect(() => {
        let filtered = [...users]

        // Search filter
        if (searchText) {
            filtered = filtered.filter(
                (user) =>
                    user.username
                        .toLowerCase()
                        .includes(searchText.toLowerCase()) ||
                    user.fullName
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
            )
        }

        // Role filter
        if (roleFilter !== undefined) {
            filtered = filtered.filter((user) => user.role === roleFilter)
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue: any = a[sortField as keyof UserEntity]
            let bValue: any = b[sortField as keyof UserEntity]

            if (sortField === 'createdAt') {
                aValue = new Date(aValue).getTime()
                bValue = new Date(bValue).getTime()
            }

            if (sortOrder === 'ascend') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        setFilteredUsers(filtered)
    }, [users, searchText, roleFilter, sortField, sortOrder])

    // Modal handlers
    const showModal = () => {
        setEditingUser(null)
        setIsModalVisible(true)
    }

    const showEditModal = (user: UserEntity) => {
        setEditingUser(user)
        setIsModalVisible(true)
    }

    const showDeleteModal = (user: UserEntity) => {
        setDeletingUser(user)
        setIsDeleteModalVisible(true)
    }

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log('Form Values: ', values)
                if (editingUser) {
                    // Update user
                    const updatedUsers = users.map((user: { id: number; }) =>
                        user.id === editingUser.id
                            ? { ...user, ...values }
                            : user
                    )
                    setUsers(updatedUsers)
                    message.success('Cập nhật người dùng thành công!')
                } else {
                    // Add new user
                    const newUser: UserEntity = {
                        id: Math.max(...users.map((u: { id: number; }) => u.id)) + 1,
                        ...values,
                        createdAt: new Date().toISOString(),
                    }
                    setUsers([...users, newUser])
                    message.success('Thêm người dùng thành công!')
                }
                form.resetFields()
                setIsModalVisible(false)
            })
            .catch((info) => {
                console.log('Validate Failed:', info)
            })
    }

    const handleDelete = () => {
        if (deletingUser) {
            const updatedUsers = users.filter(
                (user: { id: number; }) => user.id !== deletingUser.id
            )
            setUsers(updatedUsers)
            message.success('Xóa người dùng thành công!')
            setIsDeleteModalVisible(false)
            setDeletingUser(null)
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

    // Search, Filter, Sort handlers - ✅ Sử dụng navigate để update URL
    const handleSearch = (value: string) => {
        navigate({
            search: (prev: UserSearch) => ({ ...prev, search: value || undefined })
        })
    }

    const handleRoleFilter = (value: number | undefined) => {
        navigate({
            search: (prev: UserSearch) => ({ ...prev, role: value })
        })
    }

    const handleSort = (field: string, order: 'ascend' | 'descend') => {
        navigate({
            search: (prev: UserSearch) => ({ ...prev, sortField: field, sortOrder: order })
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
            }
        })
    }

    // Statistics
    const adminCount = filteredUsers.filter((user) => user.role === 0).length
    const staffCount = filteredUsers.filter((user) => user.role === 1).length

    return {
        // Data
        users: filteredUsers,
        totalUsers: filteredUsers.length,
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
