import React, { useEffect } from "react";
import { Form, Input } from "antd";
import type { SupplierEntity } from "../types/entity";

interface Props {
  initialValues?: SupplierEntity | null;
  onSubmit: (values: Omit<SupplierEntity, "id">) => void;
}

export const SupplierForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues]);

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item name="name" label="Tên nhà cung cấp" rules={[{ required: true }]}>
        <Input placeholder="Nhập tên nhà cung cấp" />
      </Form.Item>
      <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ type: "email", required: true }]}>
        <Input placeholder="Nhập email" />
      </Form.Item>
      <Form.Item name="address" label="Địa chỉ">
        <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
      </Form.Item>
      <div style={{ textAlign: "right" }}>
        <button type="submit" className="ant-btn ant-btn-primary">
          Lưu
        </button>
      </div>
    </Form>
  );
};
