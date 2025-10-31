// src/features/customers/components/CustomerSearch.tsx
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Props {
  value: string;
  onSearch: (value: string) => void;
}

export const CustomerSearch: React.FC<Props> = ({ value, onSearch }) => {
  return (
    <Input
      placeholder="Tìm kiếm tên, email, SĐT..."
      value={value}
      onChange={(e) => onSearch(e.target.value)}
      prefix={<SearchOutlined />}
      allowClear
      style={{ width: 300, marginBottom: 16 }}
    />
  );
};