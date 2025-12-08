import { Modal, Space } from 'antd'
import { PlusOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { UserForm } from './UserForm'
import type { UserNoPass } from '../types/entity'
import type { FormInstance } from 'antd/es/form'

interface UserModalsProps {
    isModalVisible: boolean
    isDeleteModalVisible: boolean
    isNotificationModalVisible: boolean
    notificationType: 'success' | 'error'
    notificationMessage: string
    editingUser: UserNoPass | null
    deletingUser: UserNoPass | null
    form: FormInstance
    onModalOk: () => void
    onModalCancel: () => void
    onDeleteOk: () => void
    onDeleteCancel: () => void
    onNotificationClose: () => void
}

export const UserModals = ({
    isModalVisible,
    isDeleteModalVisible,
    isNotificationModalVisible,
    notificationType,
    notificationMessage,
    editingUser,
    deletingUser,
    form,
    onModalOk,
    onModalCancel,
    onDeleteOk,
    onDeleteCancel,
    onNotificationClose,
}: UserModalsProps) => {
    return (
        <>
            {/* Add/Edit Modal */}
            <Modal
                title={
                    <Space>
                        <PlusOutlined style={{ color: '#1890ff' }} />
                        <span>
                            {editingUser
                                ? 'Chỉnh sửa người dùng'
                                : 'Thêm người dùng mới'}
                        </span>
                    </Space>
                }
                open={isModalVisible}
                onOk={onModalOk}
                onCancel={onModalCancel}
                width={600}
                okText={editingUser ? 'Cập nhật' : 'Tạo người dùng'}
                cancelText="Hủy"
                okButtonProps={{
                    style: { borderRadius: '8px' },
                }}
                cancelButtonProps={{
                    style: { borderRadius: '8px' },
                }}
            >
                <UserForm
                    key={editingUser ? `edit-${editingUser.id}` : 'add-new'}
                    form={form}
                    isEdit={!!editingUser}
                    initialValues={editingUser || undefined}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={isDeleteModalVisible}
                onOk={onDeleteOk}
                onCancel={onDeleteCancel}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{
                    danger: true,
                    style: { borderRadius: '8px' },
                }}
                cancelButtonProps={{
                    style: { borderRadius: '8px' },
                }}
            >
                <p>
                    Bạn có chắc chắn muốn xóa người dùng{' '}
                    <strong>{deletingUser?.fullName}</strong> không?
                </p>
                <p>Hành động này không thể hoàn tác.</p>
            </Modal>

            {/* Notification Modal (Success/Error) */}
            <Modal
                title={
                    <Space>
                        {notificationType === 'success' ? (
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                        ) : (
                            <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
                        )}
                        <span>
                            {notificationType === 'success' ? 'Thành công' : 'Lỗi'}
                        </span>
                    </Space>
                }
                open={isNotificationModalVisible}
                onOk={onNotificationClose}
                onCancel={onNotificationClose}
                okText="Đóng"
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{
                    style: { borderRadius: '8px' },
                    type: notificationType === 'success' ? 'primary' : 'default',
                }}
                width={400}
            >
                <p style={{ marginTop: '16px', fontSize: '16px' }}>{notificationMessage}</p>
            </Modal>
        </>
    )
}
