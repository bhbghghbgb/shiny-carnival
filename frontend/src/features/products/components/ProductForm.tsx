import { Form, Input, InputNumber, Upload, Button, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadImageToImageKit } from '../api/imageKitService';
import type { UploadFile } from 'antd/es/upload/interface';

interface ProductFormProps {
  form: any;
}

export const ProductForm = ({ form }: ProductFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadImageToImageKit(file);
      
      // Set imageUrl và imageFileId vào form
      form.setFieldsValue({
        imageUrl: result.url,
        imageFileId: result.fileId,
      });
      
      setPreviewImage(result.url);
      message.success('Upload ảnh thành công!');
      return false; // Prevent default upload behavior
    } catch (error) {
      message.error(
        error instanceof Error
          ? `Lỗi upload ảnh: ${error.message}`
          : 'Lỗi upload ảnh'
      );
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    form.setFieldsValue({
      imageUrl: undefined,
      imageFileId: undefined,
    });
    setPreviewImage(null);
  };

  // Watch form values để update preview khi form được load với data có sẵn
  const imageUrl = form.getFieldValue('imageUrl');
  const currentPreview = previewImage || imageUrl;

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

      {/* Image Upload Section */}
      <Form.Item label="Product Image">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Upload
            beforeUpload={(file) => {
              handleImageUpload(file);
              return false; // Prevent default upload
            }}
            showUploadList={false}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
              {uploading ? 'Đang upload...' : 'Upload Image'}
            </Button>
          </Upload>

          {/* Preview Image */}
          {currentPreview && (
            <div style={{ marginTop: '8px' }}>
              <Image
                src={currentPreview}
                alt="Product preview"
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                preview={false}
              />
              <Button
                type="link"
                danger
                onClick={handleRemoveImage}
                style={{ marginTop: '8px' }}
              >
                Xóa ảnh
              </Button>
            </div>
          )}
        </div>
      </Form.Item>

      {/* Hidden fields để lưu imageUrl và imageFileId */}
      <Form.Item name="imageUrl" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="imageFileId" hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};
