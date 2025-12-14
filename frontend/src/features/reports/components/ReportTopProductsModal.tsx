import { Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { productColumns } from '../../products/config/productPageConfig';
import type { TopProductDto } from '../types/entity';

interface ReportTopProductsModalProps {
  open: boolean;
  onClose: () => void;
  startDate: string;
  endDate: string;
  data: TopProductDto[];
  total: number;
  isLoading: boolean;
}

/**
 * ReportTopProductsModal - Modal hiển thị danh sách top products
 * Tái sử dụng productColumns từ ProductManagementPage và thêm các cột report
 */
export const ReportTopProductsModal = ({
  open,
  onClose,
  data,
  total,
  isLoading,
}: ReportTopProductsModalProps) => {
  // Tái sử dụng cột productName từ productColumns
  const productNameColumn = productColumns.find(
    (col): col is { title: string; dataIndex: string; sorter?: boolean } => 
      'dataIndex' in col && col.dataIndex === 'productName'
  );
  
  // Columns cho Top Products - kết hợp productColumns và các cột report
  const topProductColumns: ColumnsType<TopProductDto> = [
    // Tái sử dụng title và sorter từ productColumns
    {
      title: productNameColumn?.title || 'Tên sản phẩm',
      dataIndex: 'productName',
      sorter: productNameColumn?.sorter ?? true,
    },
    // Các cột report-specific
    {
      title: 'Số lượng bán',
      dataIndex: 'totalQuantitySold',
      sorter: true,
      render: (value: number) => value?.toLocaleString(),
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'totalRevenue',
      sorter: true,
      render: (value: number) => <strong style={{ color: '#52c41a' }}>{value?.toLocaleString()} đ</strong>,
    },
    {
      title: 'Số đơn hàng',
      dataIndex: 'orderCount',
      sorter: true,
      render: (value: number) => value?.toLocaleString(),
    },
  ];

  if (!open) {
    return null;
  }

  return (
    <Modal
      title="Sản phẩm bán chạy"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      destroyOnClose={false}
    >
      <Table<TopProductDto>
        columns={topProductColumns}
        dataSource={data}
        rowKey="productId"
        loading={isLoading}
        pagination={{
          total,
          pageSize: 100,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
        }}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'Không có dữ liệu',
        }}
      />
    </Modal>
  );
};

