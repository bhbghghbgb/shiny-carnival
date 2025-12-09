import { Space } from 'antd'
import { UserHeader } from '../components/UserHeader'
import { UserStatistics } from '../components/UserStatistics'
import { UserSearchFilter } from '../components/UserSearchFilter'
import { useUserManagementPage } from '../hooks/useUserManagementPage'
import { GenericPage } from '../../../components/GenericCRUD/GenericPage'
import { userPageConfig } from '../config/userPageConfig'
import type { CreateUserRequest, UpdateUserRequest } from '../types/api'
import type { UserNoPass } from '../types/entity'


export function UserManagementPage() {
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
    } = useUserManagementPage()

    const handleCreate = (values: CreateUserRequest) => createUser.mutateAsync(values)
    const handleUpdate = (record: UserNoPass, values: UpdateUserRequest) =>
        updateUser.mutateAsync({ id: record.id, data: values })
    const handleDelete = (record: UserNoPass) => deleteUser.mutateAsync(record.id)

    return (
        <div
            style={{
                padding: '24px',
                background: '#f5f5f5',
                minHeight: '100vh',
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
            />
        </div>
    )
}
