// src/features/customers/components/CustomerHeader.tsx
import { Button, Space, Typography } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Props {
  total: number;
  onAdd: () => void;
  onRefresh: () => void;
}

export const CustomerHeader: React.FC<Props> = ({ total, onAdd, onRefresh }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <Title level={3} style={{ margin: 0 }}>
        Quản lý khách hàng ({total})
      </Title>
      <Space>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Làm mới
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Thêm khách hàng
        </Button>
      </Space>
    </div>
  );
};