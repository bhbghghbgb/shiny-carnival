import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { customerColumns } from '../../customers/config/customerPageConfig';
import type { TopCustomerDto } from '../types/entity';

interface ReportTopCustomersModalProps {
  open: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  data: TopCustomerDto[];
  total: number;
  isLoading: boolean;
}

/**
 * ReportTopCustomersModal - Modal hiển thị danh sách top customers
 * Tái sử dụng customerColumns từ CustomerManagementPage và thêm các cột report
 */
export const ReportTopCustomersModal = ({
  open,
  onClose,
  data,
  total,
  isLoading,
}: ReportTopCustomersModalProps) => {
  // Tái sử dụng cột name từ customerColumns
  const customerNameColumn = customerColumns.find(
    (col): col is { title: string; dataIndex: string; sorter?: boolean } => 
      'dataIndex' in col && col.dataIndex === 'name'
  );
  
  // Columns cho Top Customers - kết hợp customerColumns và các cột report
  const topCustomerColumns: ColumnsType<TopCustomerDto> = [
    // Tái sử dụng title và sorter từ customerColumns
    {
      title: customerNameColumn?.title || 'Tên khách hàng',
      dataIndex: 'customerName',
      sorter: customerNameColumn?.sorter ?? true,
    },
    // Các cột report-specific
    {
      title: 'Tổng đơn hàng',
      dataIndex: 'totalOrders',
      sorter: true,
      render: (value: number) => value?.toLocaleString(),
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpent',
      sorter: true,
      render: (value: number) => <strong style={{ color: '#1890ff' }}>{value?.toLocaleString()} đ</strong>,
    },
    {
      title: 'Đơn hàng cuối',
      dataIndex: 'lastOrderDate',
      sorter: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString('vi-VN') : '--',
    },
  ];

  return (
    <Modal
      title="Khách hàng mua nhiều"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Table<TopCustomerDto>
        columns={topCustomerColumns}
        dataSource={data}
        rowKey="customerId"
        loading={isLoading}
        pagination={{
          total,
          pageSize: 100,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} khách hàng`,
        }}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'Không có dữ liệu',
        }}
      />
    </Modal>
  );
};

