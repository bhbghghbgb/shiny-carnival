// frontend/src/components/common/GenericModal.tsx
import { Modal, Form, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { GenericPageConfig } from '../../types/generic-page';

interface GenericModalProps<T> {
    isOpen: boolean;
    isEdit: boolean;
    editingItem: T | null;
    form: any;
    formFields: any[];
    formConfig?: any;
    onOk: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const GenericModal = <T,>({
    isOpen,
    isEdit,
    editingItem,
    form,
    formFields,
    formConfig,
    onOk,
    onCancel,
    loading = false,
}: GenericModalProps<T>) => {
    return (
        <Modal
            title={
                <Space>
                    {isEdit ? (
                        <EditOutlined style={{ color: '#1890ff' }} />
                    ) : (
                        <PlusOutlined style={{ color: '#52c41a' }} />
                    )}
                    <span>
                        {isEdit
                            ? `Chỉnh sửa ${formConfig?.entityName || 'thông tin'}`
                            : `Thêm ${formConfig?.entityName || 'mới'}`}
                    </span>
                </Space>
            }
            open={isOpen}
            onOk={onOk}
            onCancel={onCancel}
            width={600}
            okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
            cancelText="Hủy"
            confirmLoading={loading}
            okButtonProps={{
                style: { borderRadius: '8px' },
            }}
            cancelButtonProps={{
                style: { borderRadius: '8px' },
            }}
        >
            <Form
                form={form}
                layout={formConfig?.layout || 'vertical'}
                labelCol={formConfig?.labelCol}
                wrapperCol={formConfig?.wrapperCol}
                initialValues={formConfig?.initialValues}
                preserve={false}
                style={{ marginTop: '24px' }}
            >
                {formFields.map((field: any) => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        rules={field.rules}
                        {...field}
                    >
                        {field.component}
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    );
};