import { Space } from 'antd'
import { UserHeader } from '../components/UserHeader'
import { UserStatistics } from '../components/UserStatistics'
import { UserSearchFilter } from '../components/UserSearchFilter'
import { UserTable } from '../components/UserTable'
import { UserModals } from '../components/UserModals'
import { useUserManagement } from '../hooks/useUserManagementMock'
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/admin/users');

export function UserManagementMockPage() {
    const { users } = routeApi.useLoaderData();
    const params = routeApi.useParams();

    console.log('Users:', users);
    console.log('Route params:', params);

    const {
        // Data
        totalUsers,
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
    } = useUserManagement()

    return (
        <div
            style={{
                padding: '24px',
                background: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <UserHeader onAddUser={showModal} />

                {/* Statistics */}
                <UserStatistics
                    totalUsers={totalUsers}
                    adminCount={adminCount}
                    staffCount={staffCount}
                />

                {/* Search and Filter Controls */}
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

                {/* Table */}
                <UserTable
                    users={users}
                    onEditUser={showEditModal}
                    onDeleteUser={showDeleteModal}
                />
            </Space>

            {/* Modals */}
            <UserModals
                isModalVisible={isModalVisible}
                isDeleteModalVisible={isDeleteModalVisible}
                editingUser={editingUser}
                deletingUser={deletingUser}
                form={form}
                onModalOk={handleOk}
                onModalCancel={handleCancel}
                onDeleteOk={handleDelete}
                onDeleteCancel={handleDeleteCancel}
            />
        </div>
    )
}
