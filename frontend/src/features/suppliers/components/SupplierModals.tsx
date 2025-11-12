import React from "react";
import { Modal } from "antd";
import type { SupplierEntity } from "../types/entity";
import { SupplierForm } from "./SupplierForm";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SupplierEntity, "id">) => void;
  initialValues?: SupplierEntity | null;
  isEditing: boolean;
}

export const SupplierModals: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  isEditing,
}) => (
  <Modal
    title={isEditing ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
    open={visible}
    onCancel={onClose}
    footer={null}
    destroyOnClose
  >
    <SupplierForm initialValues={initialValues} onSubmit={onSubmit} />
  </Modal>
);
