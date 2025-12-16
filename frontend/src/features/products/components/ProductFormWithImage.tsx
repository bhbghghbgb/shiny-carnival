import { Form, Input, InputNumber, Upload, Button, message, Image, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { uploadImageToImageKit } from '../api/imageKitService';
import { DropDownWithFilter } from '../../../components/common/DropDownWithFilter';
import { categoryApiService } from '../../categories/api';
import { supplierApiService } from '../../suppliers/api';
import type { CategoryEntity } from '../../categories/types/entity';
import type { SupplierEntity } from '../../suppliers/types/entity';
import type { DropDownWithFilterOption } from '../../../components/common/DropDownWithFilter';
import type { CreateProductRequest, UpdateProductRequest } from '../types/api';
import type { ProductEntity } from '../types/entity';

interface ProductFormWithImageProps {
  mode: 'create' | 'update';
  onSubmit: (values: CreateProductRequest | UpdateProductRequest) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
  initialValues?: Partial<CreateProductRequest | UpdateProductRequest>;
  record?: ProductEntity;
}

async function fetchCategoryOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
  const paged = await categoryApiService.getPaginated({
    search: keyword || undefined,
    page: 1,
    pageSize: 20,
  });
  const items = paged.items ?? [];
  return items.map((c: CategoryEntity) => ({ label: c.categoryName ?? `#${c.id}`, value: c.id }));
}

async function fetchSupplierOptions(keyword: string): Promise<DropDownWithFilterOption[]> {
  const paged = await supplierApiService.getPaginated({
    search: keyword || undefined,
    page: 1,
    pageSize: 20,
  });
  const items = paged.items ?? [];
  return items.map((s: SupplierEntity) => ({ label: s.name ?? `#${s.id}`, value: s.id }));
}

export function ProductFormWithImage({
  mode,
  onSubmit,
  onCancel,
  loading,
  errorMessage,
  onClearError,
  initialValues,
}: ProductFormWithImageProps) {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Store imageUrl and imageFileId in state to prevent loss during form submission
  const [imageUrlState, setImageUrlState] = useState<string | undefined>(undefined);
  const [imageFileIdState, setImageFileIdState] = useState<string | undefined>(undefined);

  // Load initial values vào form và preview image
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.imageUrl) {
        setPreviewImage(initialValues.imageUrl);
        setImageUrlState(initialValues.imageUrl);
      }
      if (initialValues.imageFileId) {
        setImageFileIdState(initialValues.imageFileId);
      }
    }
  }, [initialValues, form]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadImageToImageKit(file);

      // Set imageUrl và imageFileId vào form AND state
      form.setFieldsValue({
        imageUrl: result.url,
        imageFileId: result.fileId,
      });
      
      // Also store in state to prevent loss
      setImageUrlState(result.url);
      setImageFileIdState(result.fileId);

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
    setImageUrlState(undefined);
    setImageFileIdState(undefined);
    setPreviewImage(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields first
      await form.validateFields();
      
      // Get all form values including hidden fields (imageUrl, imageFileId)
      // Use getFieldsValue with nameList to ensure we get all fields
      const values = form.getFieldsValue([
        'productName',
        'barcode',
        'price',
        'unit',
        'categoryId',
        'supplierId',
        'imageUrl',
        'imageFileId',
      ]);

      // CRITICAL: Use state values as fallback if form values are missing
      const finalImageUrl = values.imageUrl ?? imageUrlState;
      const finalImageFileId = values.imageFileId ?? imageFileIdState;

      // Map values theo mode
      if (mode === 'create') {
        // Use state values as fallback for create mode too
        const createImageUrl = values.imageUrl ?? imageUrlState;
        const createImageFileId = values.imageFileId ?? imageFileIdState;
        
        const payload: CreateProductRequest = {
          productName: values.productName,
          barcode: values.barcode,
          price: values.price,
          unit: values.unit,
          categoryId: values.categoryId,
          supplierId: values.supplierId,
          imageUrl: createImageUrl,
          imageFileId: createImageFileId,
        };
        
        await onSubmit(payload);
        // Reset form và state sau khi submit thành công (để tránh giữ giá trị cũ khi mở form mới)
        form.resetFields();
        setImageUrlState(undefined);
        setImageFileIdState(undefined);
        setPreviewImage(null);
      } else {
        const payload: UpdateProductRequest = {};
        if (values.productName !== undefined && values.productName !== '') {
          payload.productName = values.productName;
        }
        if (values.barcode !== undefined && values.barcode !== '') {
          payload.barcode = values.barcode;
        }
        if (values.price !== undefined && values.price !== null) {
          payload.price = values.price;
        }
        if (values.unit !== undefined && values.unit !== '') {
          payload.unit = values.unit;
        }
        if (values.categoryId !== undefined && values.categoryId !== null) {
          payload.categoryId = values.categoryId;
        }
        if (values.supplierId !== undefined && values.supplierId !== null) {
          payload.supplierId = values.supplierId;
        }
        
        // CRITICAL: Use state values as fallback if form values are missing
        // Include imageUrl and imageFileId if they exist (even if empty string, to allow clearing)
        if (finalImageUrl !== undefined && finalImageUrl !== null && finalImageUrl !== '') {
          payload.imageUrl = finalImageUrl;
        }
        if (finalImageFileId !== undefined && finalImageFileId !== null && finalImageFileId !== '') {
          payload.imageFileId = finalImageFileId;
        }
        
        await onSubmit(payload);
        // Reset form và state sau khi submit thành công
        form.resetFields();
        setImageUrlState(undefined);
        setImageFileIdState(undefined);
        setPreviewImage(null);
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // Validation errors - Ant Design will display them automatically
        return;
      }
      const msg = error instanceof Error ? error.message : 'Thao tác không thành công';
      message.error(msg);
    }
  };

  // Watch form values để update preview khi form được load với data có sẵn
  const imageUrl = Form.useWatch('imageUrl', form);
  const currentPreview = previewImage || imageUrl || null;

  return (
    <div>
      {errorMessage && (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          showIcon
          closable
          message={errorMessage}
          onClose={onClearError}
        />
      )}

      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
      >
        <Form.Item
          name="productName"
          label="Tên sản phẩm"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="barcode"
          label="Barcode"
          rules={mode === 'create' ? [{ required: true, message: 'Vui lòng nhập barcode' }] : []}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá"
          rules={mode === 'create' ? [{ required: true, message: 'Vui lòng nhập giá' }] : []}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Đơn vị"
          rules={mode === 'create' ? [{ required: true, message: 'Vui lòng nhập đơn vị' }] : []}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Danh mục"
          rules={mode === 'create' ? [{ required: true, message: 'Vui lòng chọn danh mục' }] : []}
        >
          <DropDownWithFilter
            placeholder="Chọn danh mục"
            fetchOptions={fetchCategoryOptions}
            queryKeyPrefix="category-select"
            fetchOnEmpty={true}
          />
        </Form.Item>

        <Form.Item
          name="supplierId"
          label="Nhà cung cấp"
          rules={mode === 'create' ? [{ required: true, message: 'Vui lòng chọn nhà cung cấp' }] : []}
        >
          <DropDownWithFilter
            placeholder="Chọn nhà cung cấp"
            fetchOptions={fetchSupplierOptions}
            queryKeyPrefix="supplier-select"
            fetchOnEmpty={true}
          />
        </Form.Item>

        {/* Image Upload Section */}
        <Form.Item label="Hình ảnh sản phẩm">
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
                  style={{ marginTop: '8px', display: 'block' }}
                >
                  Xóa ảnh
                </Button>
              </div>
            )}
          </div>
        </Form.Item>

        {/* Hidden fields để lưu imageUrl và imageFileId */}
        {/* Không dùng hidden, dùng preserve để đảm bảo giá trị được giữ lại */}
        <Form.Item name="imageUrl" hidden preserve>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="imageFileId" hidden preserve>
          <Input type="hidden" />
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {mode === 'create' ? 'Tạo' : 'Cập nhật'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

