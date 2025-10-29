import { Form, Input, InputNumber } from 'antd';

interface ProductFormProps {
  form: any;
}

export const ProductForm = ({ form }: ProductFormProps) => {
  return (
    <Form form={form} layout="vertical" name="product_form">
      <Form.Item
        name="productName"
        label="Product Name"
        rules={[{ required: true, message: 'Please input the product name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="barcode"
        label="Barcode"
        rules={[{ required: true, message: 'Please input the barcode!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: 'Please input the price!' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="unit"
        label="Unit"
        rules={[{ required: true, message: 'Please input the unit!' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};
