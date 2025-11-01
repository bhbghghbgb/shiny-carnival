// src/features/customers/hook/useCustomerManagement.ts
import { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import type { CustomerEntity } from '../types/entity';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/customers');

export const useCustomerPage = () => {
  // Lấy dữ liệu từ loader
  const { customers: initialCustomers } = routeApi.useLoaderData();
  const [customers, setCustomers] = useState<CustomerEntity[]>(initialCustomers || []);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerEntity[]>([]);

  // Modal & Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerEntity | null>(null);
  const [form] = Form.useForm();

  // Search, Filter, Sort
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');

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

  // Filter & Sort logic
  useEffect(() => {
    let filtered = [...customers];

    // Tìm kiếm theo tên, email, SĐT
    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.email.toLowerCase().includes(lower) ||
          c.phone.includes(searchText)
      );
    }

    // Sắp xếp
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof CustomerEntity];
      let bValue: any = b[sortField as keyof CustomerEntity];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'ascend') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCustomers(filtered);
  }, [customers, searchText, sortField, sortOrder]);

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

  // CRUD (Client-side mock – giống như User)
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingCustomer) {
          // Cập nhật
          const updated = customers.map((c) =>
            c.id === editingCustomer.id ? { ...c, ...values } : c
          );
          setCustomers(updated);
          message.success('Cập nhật khách hàng thành công!');
        } else {
          // Thêm mới
          const newCustomer: CustomerEntity = {
            id: Math.max(...customers.map((c) => c.id), 0) + 1,
            ...values,
            createdAt: new Date().toISOString(),
          };
          setCustomers([...customers, newCustomer]);
          message.success('Thêm khách hàng thành công!');
        }
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (customer: CustomerEntity) => {
    const updated = customers.filter((c) => c.id !== customer.id);
    setCustomers(updated);
    message.success('Xóa khách hàng thành công!');
  };

  // Search & Sort
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleSort = (field: string, order: 'ascend' | 'descend') => {
    setSortField(field);
    setSortOrder(order);
  };

  const clearFilters = () => {
    setSearchText('');
    setSortField('createdAt');
    setSortOrder('descend');
  };

    const refresh = () => {
      setCustomers(initialCustomers || []);
      clearFilters();
    };

  // Thống kê
  const totalCustomers = filteredCustomers.length;

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
    refresh
  };
};