// src/features/customers/hook/useCustomerList.ts
import { useState, useEffect } from 'react';
import { message } from 'antd';
import type { CustomerEntity } from '../types/entity';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/customers');

export const useCustomerList = () => {
  // Lấy từ loader
  const { customers: initialCustomers } = routeApi.useLoaderData();
  const [customers, setCustomers] = useState<CustomerEntity[]>(initialCustomers || []);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerEntity[]>([]);

  // Search & Sort
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');

  // Cập nhật filtered khi có thay đổi
  useEffect(() => {
    let filtered = [...customers];

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.email.toLowerCase().includes(lower) ||
          c.phone.includes(searchText)
      );
    }

    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof CustomerEntity];
      let bValue: any = b[sortField as keyof CustomerEntity];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      return sortOrder === 'ascend'
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1;
    });

    setFilteredCustomers(filtered);
  }, [customers, searchText, sortField, sortOrder]);

  // Handlers
  const handleSearch = (value: string) => setSearchText(value);
  const handleSort = (field: string, order: 'ascend' | 'descend' | null) => {
    if (!order) {
      setSortField('createdAt');
      setSortOrder('descend');
    } else {
      setSortField(field);
      setSortOrder(order);
    }
  };
  const clearFilters = () => {
    setSearchText('');
    setSortField('createdAt');
    setSortOrder('descend');
  };

  const handleDelete = (customer: CustomerEntity) => {
    const updated = customers.filter((c) => c.id !== customer.id);
    setCustomers(updated);
    message.success('Xóa khách hàng thành công!');
  };

  const refresh = () => {
    setCustomers(initialCustomers || []);
    clearFilters();
  };

  return {
    customers: filteredCustomers,
    totalCustomers: filteredCustomers.length,
    searchText,
    sortField,
    sortOrder,
    handleSearch,
    handleSort,
    clearFilters,
    handleDelete,
    refresh,
    // Dùng để cập nhật sau khi tạo/sửa
    setCustomers,
  };
};