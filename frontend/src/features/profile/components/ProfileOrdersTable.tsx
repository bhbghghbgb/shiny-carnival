import React, { useState } from 'react';
import { GenericPage } from '../../../components/GenericCRUD/GenericPage/GenericPage';
import { orderColumns } from '../../orders/config/orderPageConfig';
import { orderApiService } from '../../orders/api/OrderApiService';
import type { OrderEntity } from '../../orders/types/entity';
import { useQuery } from '@tanstack/react-query';
import { createPaginatedQueryOptions } from '../../../lib/query/queryOptionsFactory';
import type { PagedRequest } from '../../../lib/api/types/api.types';

interface ProfileOrdersTableProps {
  userId: number;
}

export const ProfileOrdersTable: React.FC<ProfileOrdersTableProps> = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');

  // Build request params với userId filter
  const params: PagedRequest = {
    page,
    pageSize,
    sortBy: sortField === 'orderDate' ? 'OrderDate' :
      sortField === 'totalAmount' ? 'TotalAmount' :
      sortField === 'finalAmount' ? 'FinalAmount' : 'Id',
    sortDesc: sortOrder === 'descend',
    userId, // Filter orders by current user
  };

  // Query orders của user
  const queryOptions = createPaginatedQueryOptions<OrderEntity>(
    'profile-orders',
    orderApiService,
    params,
  );

  const { data, isLoading } = useQuery(queryOptions);

  const orders = data?.items ?? [];
  const total = data?.totalCount ?? 0;

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, order: 'ascend' | 'descend') => {
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <GenericPage<OrderEntity, never, never>
      config={{
        entity: {
          name: 'orders',
          displayName: 'Đơn hàng',
          displayNamePlural: 'Đơn hàng',
        },
        table: {
          columns: orderColumns,
          rowKey: 'id',
        },
        form: {
          create: [],
          update: [],
        },
        features: {
          enableCreate: false,
          enableEdit: false,
          enableDelete: false,
        },
      }}
      data={orders}
      total={total}
      loading={isLoading}
      page={page}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onSortChange={handleSortChange}
      sortField={sortField}
      sortOrder={sortOrder}
    />
  );
};

