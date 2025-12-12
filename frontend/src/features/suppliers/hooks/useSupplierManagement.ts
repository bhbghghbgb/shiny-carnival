import { useState } from "react";
import type { SupplierEntity } from "../types/entity";

export function useSupplierManagement() {
  const [suppliers, setSuppliers] = useState<SupplierEntity[]>([
    { id: 1, name: "Công ty A", phone: "0909123456", email: "a@company.com", address: "TP.HCM" },
    { id: 2, name: "Công ty B", phone: "0911222333", email: "b@company.com", address: "Hà Nội" },
  ]);
  const [selected, setSelected] = useState<SupplierEntity | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const addSupplier = (supplier: Omit<SupplierEntity, "id">) => {
    const newSupplier = { ...supplier, id: Date.now() };
    setSuppliers([...suppliers, newSupplier]);
  };

  const editSupplier = (supplier: SupplierEntity) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplier.id ? supplier : s))
    );
  };

  const deleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  return {
    suppliers,
    selected,
    setSelected,
    modalVisible,
    setModalVisible,
    isEditing,
    setIsEditing,
    addSupplier,
    editSupplier,
    deleteSupplier,
  };
}
