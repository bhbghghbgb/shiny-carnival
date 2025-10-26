import { Modal, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { UserForm } from './UserForm'
import type { UserEntity } from '../types/entity'

interface UserModalsProps {
    isModalVisible: boolean
    isDeleteModalVisible: boolean
    editingUser: UserEntity | null
    deletingUser: UserEntity | null
    form: any
    onModalOk: () => void
    onModalCancel: () => void
    onDeleteOk: () => void
    onDeleteCancel: () => void
}

export const UserModals = ({
    isModalVisible,
    isDeleteModalVisible,
    editingUser,
    deletingUser,
    form,
    onModalOk,
    onModalCancel,
    onDeleteOk,
    onDeleteCancel,
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
        </>
    )
}
