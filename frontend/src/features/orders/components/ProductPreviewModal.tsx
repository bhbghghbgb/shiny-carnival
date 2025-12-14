import { Modal, Descriptions, Button, Space, Typography, Tag } from 'antd';
import type { ProductEntity } from '../../products/types/entity';

const { Title, Text } = Typography;

interface ProductPreviewModalProps {
  product: ProductEntity | null;
  open: boolean;
  onConfirm: (product: ProductEntity) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductPreviewModal({
  product,
  open,
  onConfirm,
  onCancel,
  loading = false,
}: ProductPreviewModalProps) {
  const handleConfirm = () => {
    if (product) {
      onConfirm(product);
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Xác nhận sản phẩm</Title>}
      open={open}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" onClick={handleConfirm} loading={loading}>
            Xác nhận
          </Button>
        </Space>
      }
      width={600}
      destroyOnClose
    >
      {product ? (
        <Descriptions title="Thông tin sản phẩm" bordered column={1}>
          <Descriptions.Item label="Tên sản phẩm">
            <Text strong>{product.productName || '--'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mã vạch">
            <Tag color="blue">{product.barcode || '--'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Giá">
            <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
              {product.price?.toLocaleString('vi-VN')} đ
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Đơn vị">
            {product.unit || '--'}
          </Descriptions.Item>
          {product.id && (
            <Descriptions.Item label="Mã sản phẩm">
              #{product.id}
            </Descriptions.Item>
          )}
        </Descriptions>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">Không có thông tin sản phẩm</Text>
        </div>
      )}
    </Modal>
  );
}

