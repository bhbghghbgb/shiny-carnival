// src/features/customers/hook/useCustomerPage.ts
import { useEffect } from 'react';
import { Form, message } from 'antd';
import { getRouteApi } from '@tanstack/react-router';
import { useCustomerStore } from '../store/customerStore';
import type { CustomerEntity } from '../types/entity';

const routeApi = getRouteApi('/customers');

export const useCustomerPage = () => {
  // Lấy dữ liệu từ loader (chỉ lần đầu)
  const { customers: initialCustomers } = routeApi.useLoaderData();

  // Zustand state
  const {
    filteredCustomers,
    totalCustomers,
    searchText,
    sortField,
    sortOrder,
    initCustomers,
    setSearchText,
    setSort,
    clearFilters,
    refresh,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  // Modal & Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerEntity | null>(null);
  const [form] = Form.useForm();

  // Khởi tạo dữ liệu từ loader khi mount
  useEffect(() => {
    if (initialCustomers) {
      initCustomers(initialCustomers);
    }
  }, [initialCustomers, initCustomers]);

  // Reset form khi mở modal
  useEffect(() => {
    if (isModalVisible) {
      if (editingCustomer) {
        form.setFieldsValue(editingCustomer);
      } else {
        form.resetFields();
      }
    }
  }, [editingCustomer, isModalVisible, form]);

  // Modal handlers
  const showModal = () => {
    setEditingCustomer(null);
    setIsModalVisible(true);
  };

  const showEditModal = (customer: CustomerEntity) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingCustomer) {
        updateCustomer(editingCustomer.id, values);
        message.success('Cập nhật khách hàng thành công!');
      } else {
        addCustomer(values);
        message.success('Thêm khách hàng thành công!');
      }
      form.resetFields();
      setIsModalVisible(false);
      setEditingCustomer(null);
    });
  };

  const handleDelete = (customer: CustomerEntity) => {
    deleteCustomer(customer.id);
    message.success('Xóa khách hàng thành công!');
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleSort = (field: string, order: 'ascend' | 'descend') => {
    setSort(field as keyof CustomerEntity, order);
  };

  return {
    // Data
    customers: filteredCustomers,
    totalCustomers,

    // Modal
    isModalVisible,
    editingCustomer,
    form,

    // Search/Sort
    searchText,
    sortField,
    sortOrder,

    // Handlers
    showModal,
    showEditModal,
    handleOk,
    handleCancel,
    handleDelete,
    handleSearch,
    handleSort,
    clearFilters,
    refresh,
  };
};