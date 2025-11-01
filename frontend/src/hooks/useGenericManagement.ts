// frontend/src/hooks/useGenericManagement.ts
import { useState } from 'react';
import { Form, message } from 'antd';
import type { GenericPageConfig } from '../types/generic-page';

/**
 * Custom hook để quản lý logic chung cho các trang quản lý
 *
 * @template T - Kiểu dữ liệu của entity, phải có thuộc tính `id`.
 * @param {GenericPageConfig<T>} config - Object cấu hình cho trang.
 * @param {any} loaderData - Dữ liệu được truyền từ loader của route.
 * @param {any} route - Route object để lấy search params và navigate.
 * @param {any} apiService - Service chứa các hàm API (getAll, create, update, delete).
 * @returns Object chứa các states và handlers cần thiết cho trang quản lý.
 */
export const useGenericManagement = <T extends { id: number | string }>(
    config: GenericPageConfig<T>,
    loaderData: any,
    route: any,
    apiService: any
) => {
    // States
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<T | null>(null);
    const [deletingItem, setDeletingItem] = useState<T | null>(null);
    const [form] = Form.useForm();

    // Get search params from route
    const searchParams = route.useSearch ? route.useSearch() : {};
    
    // Get navigate function from route
    const navigate = route.useNavigate ? route.useNavigate() : () => {};

    // Search, Filter, Sort states
    const [searchText, setSearchText] = useState(searchParams?.search || '');
    const [currentPage, setCurrentPage] = useState(searchParams?.page || 1);
    const [pageSize, setPageSize] = useState(searchParams?.pageSize || 20);

    // Data từ loader
    const items = loaderData?.data?.items || [];
    const pagination = {
        current: currentPage,
        pageSize: pageSize,
        total: loaderData?.data?.totalCount || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: [number, number]) =>
            `${range[0]}-${range[1]} của ${total} ${config.entityName}`,
    };

    // Handlers
    const showModal = () => {
        setEditingItem(null);
        setIsModalVisible(true);
        setTimeout(() => {
            form.resetFields();
        }, 0);
    };

    const showEditModal = (item: T) => {
        setEditingItem(item);
        setIsModalVisible(true);
        form.setFieldsValue(item);
    };

    const showDeleteModal = (item: T) => {
        setDeletingItem(item);
        setIsDeleteModalVisible(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log('Form Values: ', values);

            if (editingItem) {
                // Update item
                const response = await apiService.update(editingItem.id, values);
                if (!response.isError && response.data) {
                    message.success(`Cập nhật ${config.entityName} thành công!`);
                    // Refresh data by navigating to current page
                    navigate({ search: (prev: any) => ({ ...prev }) });
                } else {
                    message.error(
                        response.message || `Không thể cập nhật ${config.entityName}`
                    );
                }
            } else {
                // Add new item
                const response = await apiService.create(values);
                if (!response.isError && response.data) {
                    message.success(`Thêm ${config.entityName} thành công!`);
                    // Refresh data by navigating to current page
                    navigate({ search: (prev: any) => ({ ...prev }) });
                } else {
                    message.error(
                        response.message || `Không thể tạo ${config.entityName} mới`
                    );
                }
            }
            form.resetFields();
            setIsModalVisible(false);
        } catch (error: any) {
            if (error.errorFields) {
                // Form validation errors
                console.log('Validate Failed:', error);
            } else {
                // API errors
                message.error(error.message || 'Có lỗi xảy ra');
                console.error('API Error:', error);
            }
        }
    };

    const handleDelete = async () => {
        if (deletingItem) {
            try {
                const response = await apiService.delete(deletingItem.id);
                if (!response.isError && response.data) {
                    message.success(`Xóa ${config.entityName} thành công!`);
                    // Refresh data by navigating to current page
                    navigate({ search: (prev: any) => ({ ...prev }) });
                    setIsDeleteModalVisible(false);
                    setDeletingItem(null);
                } else {
                    message.error(
                        response.message || `Không thể xóa ${config.entityName}`
                    );
                }
            } catch (error: any) {
                message.error(
                    error.message || `Có lỗi xảy ra khi xóa ${config.entityName}`
                );
                console.error('Delete error:', error);
            }
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDeletingItem(null);
    };

    // Search, Filter, Sort handlers
    const handleSearch = (value: string) => {
        setSearchText(value);
        navigate({
            search: (prev: any) => ({
                ...prev,
                search: value || undefined,
                page: 1,
            }),
        });
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        
        // Handle sorting if needed
        if (sorter.field && sorter.order) {
            navigate({
                search: (prev: any) => ({
                    ...prev,
                    sortBy: sorter.field,
                    sortOrder: sorter.order,
                    page: pagination.current,
                }),
            });
        } else {
            navigate({
                search: (prev: any) => ({
                    ...prev,
                    page: pagination.current,
                }),
            });
        }
    };

    const clearFilters = () => {
        setSearchText('');
        navigate({
            search: (prev: any) => ({
                ...prev,
                search: undefined,
                page: 1,
            }),
        });
    };

    return {
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
    };
};