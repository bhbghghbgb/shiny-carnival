// src/features/customers/components/CustomerTable.tsx
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { CustomerEntity } from '../types/entity';

interface Props {
  data: CustomerEntity[];
  total: number;
  sortField: string;
  sortOrder: 'ascend' | 'descend';
  onSort: (field: string, order: 'ascend' | 'descend' | null) => void;
  onEdit: (record: CustomerEntity) => void;
  onDelete: (record: CustomerEntity) => void;
  onView?: (record: CustomerEntity) => void;
}

export const CustomerTable: React.FC<Props> = ({
  data,
  total,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onView,
}) => {
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: true,
      sortOrder: sortField === 'name' ? sortOrder : undefined,
      render: (text: string) => <strong>{text}</strong>,
    },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    { title: 'Địa chỉ', dataIndex: 'address' },
    {
      title: 'Hành động',
      width: 120,
      render: (_: any, record: CustomerEntity) => (
        <Space size="small">
          <Button size="small" icon={<EyeOutlined />} onClick={() => onView?.(record)} />
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm
            title="Xóa?"
            onConfirm={() => onDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ total }}
      onChange={(_, __, sorter: any) => onSort(sorter.field, sorter.order)}
      scroll={{ x: 800 }}
    />
  );
};