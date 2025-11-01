// frontend/src/components/pages/GenericManagementPage.tsx
import { Button, Space } from 'antd';
import type { GenericPageConfig } from '../../types/generic-page';

// Import các component generic mới
import { GenericHeader } from '../common/GenericHeader';
import { GenericSearchFilter } from '../common/GenericSearchFilter';
import { GenericTable } from '../common/GenericTable';
import { GenericModal } from '../common/GenericModal';

/**
 * Higher-Order Component để tạo trang quản lý generic
 * 
 * @template T - Kiểu dữ liệu của entity, phải có thuộc tính `id`.
 * @param {GenericPageConfig<T>} config - Object cấu hình cho trang.
 * @returns Một React Component là trang quản lý hoàn chỉnh.
 */
export function withGenericManagement<T extends { id: number; name?: string; fullName?: string }>(
    config: GenericPageConfig<T>,
    route: any,
    apiService: any,
    useGenericManagement: (config: GenericPageConfig<T>, loaderData: any, route: any, apiService: any) => any
) {
    return function GenericManagementPage({ loaderData }: { loaderData: any }) {
        const {
            // Data
            items,
            pagination,

            // Modal states
            isModalVisible,
            isDeleteModalVisible,
            editingItem,
            deletingItem,
            form,

            // Search/Filter states
            searchText,

            // Handlers
            showModal,
            showEditModal,
            showDeleteModal,
            handleOk,
            handleDelete,
            handleCancel,
            handleDeleteCancel,
            handleSearch,
            clearFilters,
            handleTableChange,
        } = useGenericManagement(config, loaderData, route, apiService);

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
                    <GenericHeader
                        config={config}
                        onAddItem={showModal}
                        customActions={config.customActions ? (
                            <>
                                {config.customActions
                                    .filter(action => !action.visible || action.visible({}))
                                    .map((action, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => action.onClick({})}
                                            disabled={action.disabled ? action.disabled({}) : false}
                                            style={{ marginLeft: '8px' }}
                                            icon={action.icon}
                                        >
                                            {action.name}
                                        </Button>
                                    ))}
                            </>
                        ) : undefined}
                    />


                    {/* Search and Filter Controls */}
                    {config.searchConfig?.enabled && (
                        <GenericSearchFilter
                            searchText={searchText}
                            onSearchChange={handleSearch}
                            onClearFilters={clearFilters}
                            searchPlaceholder={config.searchConfig.placeholder || `Tìm theo ${config.entityName}...`}
                        // filterControls={...} // Có thể truyền vào các bộ lọc tùy chỉnh
                        // sortControls={...} // Có thể truyền vào các bộ sắp xếp tùy chỉnh
                        />
                    )}

                    {/* Table */}
                    <GenericTable<T>
                        columns={config.columns}
                        dataSource={items}
                        pagination={pagination}
                        onChange={handleTableChange}
                        onEditItem={showEditModal}
                        onDeleteItem={showDeleteModal}
                        entityNamePlural={config.entityName} // Cần một cách tốt hơn để pluralize
                    />
                </Space>

                {/* Modals */}
                <GenericModal<T>
                    isOpen={isModalVisible}
                    isEdit={!!editingItem}
                    editingItem={editingItem}
                    form={form}
                    formFields={config.formFields}
                    formConfig={config.formConfig}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    loading={false} // Cần thêm state loading vào hook
                />

                {/* Delete Confirmation Modal */}
                {isDeleteModalVisible && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Xác nhận xóa</h3>
                            <p>Bạn có chắc chắn muốn xóa {config.entityName} này không?</p>
                            <div className="modal-actions">
                                <button onClick={handleDeleteCancel}>Hủy</button>
                                <button onClick={handleDelete} className="danger">Xóa</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };
}