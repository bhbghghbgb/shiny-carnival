import { useState } from 'react'
import { Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { UserHeader } from '../components/UserHeader'
import { UserStatistics } from '../components/UserStatistics'
import { UserSearchFilter } from '../components/UserSearchFilter'
import { UserDetailModal } from '../components/UserDetailModal'
import { useUserManagementPage } from '../hooks/useUserManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { userPageConfig } from '../config/userPageConfig'
import type { CreateUserRequest, UpdateUserRequest } from '../types/api'
import type { UserNoPass } from '../types/entity'


export function UserManagementPage() {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const {
        users,
        totalUsers,
        adminCount,
        staffCount,

        searchText,
        roleFilter,
        sortField,
        sortOrder,
        page,
        pageSize,

        handleSearch,
        handleRoleFilter,
        handleSort,
        handlePageChange,
        clearFilters,

        createUser,
        updateUser,
        deleteUser,
        pageErrorMessage,
        formErrorMessage,
        clearPageError,
        clearFormError,
    } = useUserManagementPage()

    const handleViewDetail = (user: UserNoPass) => {
        setSelectedUserId(user.id)
        setIsDetailModalOpen(true)
    }

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false)
        setSelectedUserId(null)
    }

    const handleCreate = async (values: CreateUserRequest) => {
        await createUser.mutateAsync(values)
    }
    const handleUpdate = async (record: UserNoPass, values: UpdateUserRequest) => {
        await updateUser.mutateAsync({ id: record.id, data: values })
    }
    const handleDelete = (record: UserNoPass) => deleteUser.mutateAsync(record.id)

    return (
        <div
            style={{
                padding: '24px',
            }}
        >
            <GenericPage<UserNoPass, CreateUserRequest, UpdateUserRequest>
                config={userPageConfig}
                data={users}
                total={totalUsers}
                loading={createUser.isPending || updateUser.isPending}
                page={page}
                pageSize={pageSize}
                sortField={sortField}
                sortOrder={sortOrder}
                onPageChange={handlePageChange}
                onSortChange={handleSort}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                createLoading={createUser.isPending}
                updateLoading={updateUser.isPending}
                deleteLoading={deleteUser.isPending}
                pageErrorMessage={pageErrorMessage}
                onClearPageError={clearPageError}
                formErrorMessage={formErrorMessage}
                onClearFormError={clearFormError}
                renderHeader={({ openCreate }) => <UserHeader onAddUser={openCreate} />}
                statisticsSlot={
                    <UserStatistics
                        totalUsers={totalUsers}
                        adminCount={adminCount}
                        staffCount={staffCount}
                    />
                }
                filtersSlot={
                    <UserSearchFilter
                        searchText={searchText}
                        roleFilter={roleFilter}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSearchChange={handleSearch}
                        onRoleFilterChange={handleRoleFilter}
                        onSortChange={handleSort}
                        onClearFilters={clearFilters}
                    />
                }
                renderCustomActions={(record) => (
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        Chi tiết
                    </Button>
                )}
            />
            <UserDetailModal
                userId={selectedUserId}
                open={isDetailModalOpen}
                onClose={handleCloseDetailModal}
            />
        </div>
    )
}
