import React, { useState } from "react";
import { message } from "antd";
import { SupplierHeader } from "../components/SupplierHeader";
import { SupplierSearchFilter } from "../components/SupplierSearchFilter";
import { SupplierStatistics } from "../components/SupplierStatistics";
import { SupplierTable } from "../components/SupplierTable";
import { SupplierModals } from "../components/SupplierModals";
import { useSupplierManagement } from "../hooks/useSupplierManagement";

export default function SupplierManagementPage() {
  const {
    suppliers,
    addSupplier,
    editSupplier,
    deleteSupplier,
    selected,
    setSelected,
    modalVisible,
    setModalVisible,
    isEditing,
    setIsEditing,
  } = useSupplierManagement();

  const [searchText, setSearchText] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend">("ascend");
  const [regionFilter, setRegionFilter] = useState<string | undefined>(undefined);

  // ✅ Lọc dữ liệu theo search + filter
  const filteredSuppliers = suppliers
    .filter((s) => s.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter((s) =>
      regionFilter ? s.address?.toLowerCase().includes(regionFilter.toLowerCase()) : true
    )
    .sort((a, b) =>
      sortOrder === "ascend"
        ? a[sortField as keyof typeof a]?.toString().localeCompare(
            b[sortField as keyof typeof b]?.toString()
          )
        : b[sortField as keyof typeof b]?.toString().localeCompare(
            a[sortField as keyof typeof a]?.toString()
          )
    );

  const handleAdd = () => {
    setIsEditing(false);
    setSelected(null);
    setModalVisible(true);
  };
    const handleSubmit = (data: any) => {
    try {
      if (isEditing && selected) {
        editSupplier({ ...selected, ...data });
        message.success("Cập nhật nhà cung cấp thành công!");
      } else {
        addSupplier(data);
        message.success("Thêm nhà cung cấp mới thành công!");
      }

      // ✅ Đóng modal sau khi lưu
      setModalVisible(false);
      setSelected(null);
    } catch (error) {
      console.error(error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };
  return (
    <div style={{ padding: 24 }}>
      <SupplierHeader onAddSupplier={handleAdd} />

      <div style={{ marginTop: 16 }}>
        <SupplierStatistics
          totalSuppliers={suppliers.length}
          filteredCount={filteredSuppliers.length} // ✅ thêm dòng này
          activeSuppliers={suppliers.length}
          productCount={120}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <SupplierSearchFilter
          searchText={searchText}
          sortField={sortField}
          sortOrder={sortOrder}
          regionFilter={regionFilter}
          onSearchChange={setSearchText}
          onRegionFilterChange={setRegionFilter}
          onSortChange={(f, o) => {
            setSortField(f);
            setSortOrder(o);
          }}
          onClearFilters={() => {
            setSearchText("");
            setRegionFilter(undefined);
            setSortField("name");
            setSortOrder("ascend");
          }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <SupplierTable
          suppliers={filteredSuppliers}
          onEdit={(s) => {
            setIsEditing(true);
            setSelected(s);
            setModalVisible(true);
          }}
          onDelete={deleteSupplier}
        />
      </div>

      <SupplierModals
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={selected}
        isEditing={isEditing}
      />
    </div>
  );
}
