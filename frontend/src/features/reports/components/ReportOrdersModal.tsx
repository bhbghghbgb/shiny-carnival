import { Modal, Table } from 'antd';
import { orderColumns } from '../../orders/config/orderPageConfig';
import type { OrderEntity } from '../../orders/types/entity';

interface ReportOrdersModalProps {
  open: boolean;
  onClose: () => void;
  data: OrderEntity[];
  total: number;
  isLoading: boolean;
}

/**
 * ReportOrdersModal - Modal hiển thị danh sách orders trong khoảng thời gian
 * Sử dụng orderColumns từ OrderManagementPage để tái sử dụng code
 * Nhận data từ props để đảm bảo đồng bộ với statistic "Tổng đơn hàng"
 */
export const ReportOrdersModal = ({
  open,
  onClose,
  data: orders,
  total,
  isLoading,
}: ReportOrdersModalProps) => {
  return (
    <Modal
      title="Chi tiết đơn hàng"
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnClose={false}
    >
      <Table<OrderEntity>
        columns={orderColumns}
        dataSource={orders}
        rowKey="id"
        loading={isLoading}
        pagination={{
          total,
          pageSize: 1000,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
        }}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'Không có dữ liệu',
        }}
      />
    </Modal>
  );
};

