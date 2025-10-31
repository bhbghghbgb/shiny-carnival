// src/features/customers/components/CustomerModal.tsx
import { Modal, Form, Input, Select } from 'antd';
import type { CustomerEntity } from '../types/entity';

const { Option } = Select;

interface Props {
  open: boolean;
  editing?: CustomerEntity | null;
  form: any;
  onOk: () => void;
  onCancel: () => void;
}

export const CustomerModal: React.FC<Props> = ({ open, editing, form, onOk, onCancel }) => {
  return (
    <Modal
      title={editing ? 'Sửa khách hàng' : 'Thêm khách hàng mới'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={editing ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};