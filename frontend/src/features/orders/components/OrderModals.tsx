import { Modal } from 'antd'
import type { OrderEntity } from '../types/entity'

interface OrderModalsProps {
    isDeleteModalVisible: boolean
    deletingOrder: OrderEntity | null
    onDeleteOk: () => void
    onDeleteCancel: () => void
}

export const OrderModals = ({
    isDeleteModalVisible,
    deletingOrder,
    onDeleteOk,
    onDeleteCancel,
}: OrderModalsProps) => {
    return (
        <>
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
                    Bạn có chắc chắn muốn xóa đơn hàng{' '}
                    <strong>#{deletingOrder?.id}</strong> không?
                </p>
                <p>Hành động này không thể hoàn tác.</p>
            </Modal>
        </>
    )
}
