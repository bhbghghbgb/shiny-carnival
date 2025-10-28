import React from "react";
import { Table, Space, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SupplierEntity } from "../types/entity";

interface Props {
  suppliers: SupplierEntity[];
  onEdit: (supplier: SupplierEntity) => void;
  onDelete: (id: number) => void;
}

export const SupplierTable: React.FC<Props> = ({ suppliers, onEdit, onDelete }) => {
  const columns: ColumnsType<SupplierEntity> = [
    { title: "ID", dataIndex: "supplier_id", key: "id", width: 80 },
    { title: "Tên nhà cung cấp", dataIndex: "name", key: "name" },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <a onClick={() => onEdit(record)}>Sửa</a>
          <Popconfirm
            title="Xóa nhà cung cấp?"
            onConfirm={() => onDelete(record.id)}
          >
            <a style={{ color: "red" }}>Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={suppliers} rowKey="supplier_id" />;
};
