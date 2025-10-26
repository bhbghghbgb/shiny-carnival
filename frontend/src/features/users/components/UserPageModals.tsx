import { Modal } from 'antd'
import { UserForm } from './UserForm'

interface UserPageModalsProps {
    isModalVisible: boolean
    isDeleteModalVisible: boolean
    editingUser: any
    deletingUser: any
    form: any
    onModalOk: () => void
    onModalCancel: () => void
    onDeleteOk: () => void
    onDeleteCancel: () => void
}

export const UserPageModals = ({
    isModalVisible,
    isDeleteModalVisible,
    editingUser,
    deletingUser,
    form,
    onModalOk,
    onModalCancel,
    onDeleteOk,
    onDeleteCancel,
}: UserPageModalsProps) => {
    return (
        <>
            {/* Add/Edit Modal */}
            <Modal
                title={editingUser ? 'Edit User' : 'Add New User'}
                open={isModalVisible}
                onOk={onModalOk}
                onCancel={onModalCancel}
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
                okButtonProps={{ danger: true }}
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
