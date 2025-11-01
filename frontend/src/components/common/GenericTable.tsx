// frontend/src/components/common/GenericTable.tsx
import { Table, Card, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { GenericPageConfig } from '../../types/generic-page';

interface GenericTableProps<T> {
    columns: ColumnsType<T>;
    dataSource: T[];
    pagination: any;
    onChange: (pagination: any, filters: any, sorter: any) => void;
    onEditItem: (item: T) => void;
    onDeleteItem: (item: T) => void;
    entityNamePlural: string;
}

export const GenericTable = <T extends { id: number | string }>({
    columns,
    dataSource,
    pagination,
    onChange,
    onEditItem,
    onDeleteItem,
    entityNamePlural,
}: GenericTableProps<T>) => {
    // Thêm cột hành động vào cuối
    const columnsWithActions: ColumnsType<T> = [
        ...columns,
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (text: any, record: T) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onEditItem(record)}
                            style={{ backgroundColor: '#1890ff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={() => onDeleteItem(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Table
                dataSource={dataSource}
                columns={columnsWithActions}
                rowKey="id"
                pagination={pagination}
                onChange={onChange}
                scroll={{ x: 'max-content' }}
                style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            />
        </Card>
    );
};