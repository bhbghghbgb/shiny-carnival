import {
  Card,
  Row,
  Col,
  Space,
  Typography,
  Input,
  Select,
  Button,
} from "antd";
import {
  SearchOutlined,
  SortAscendingOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface SupplierSearchFilterProps {
  searchText: string;
  sortField: string;
  sortOrder: "ascend" | "descend";
  regionFilter: string | undefined;
  onSearchChange: (value: string) => void;
  onRegionFilterChange: (value: string | undefined) => void;
  onSortChange: (field: string, order: "ascend" | "descend") => void;
  onClearFilters: () => void;
}

export const SupplierSearchFilter = ({
  searchText,
  sortField,
  sortOrder,
  regionFilter,
  onSearchChange,
  onRegionFilterChange,
  onSortChange,
  onClearFilters,
}: SupplierSearchFilterProps) => {
  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    onSortChange(field, order as "ascend" | "descend");
  };

  return (
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "none",
      }}
    >
      <Row gutter={16} align="middle">
        <Col span={8}>
          <Space>
            <SearchOutlined style={{ color: "#1890ff" }} />
            <Text strong>Tìm kiếm:</Text>
          </Space>
          <Input.Search
            placeholder="Tìm theo tên hoặc email..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ marginTop: "8px" }}
            allowClear
          />
        </Col>

        <Col span={6}>
          <Space>
            <FilterOutlined style={{ color: "#1890ff" }} />
            <Text strong>Khu vực:</Text>
          </Space>
          <Select
            placeholder="Tất cả khu vực"
            value={regionFilter}
            onChange={onRegionFilterChange}
            style={{ width: "100%", marginTop: "8px" }}
            allowClear
          >
            <Select.Option value="TP.HCM">TP.HCM</Select.Option>
            <Select.Option value="Hà Nội">Hà Nội</Select.Option>
            <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
          </Select>
        </Col>

        <Col span={6}>
          <Space>
            <SortAscendingOutlined style={{ color: "#1890ff" }} />
            <Text strong>Sắp xếp:</Text>
          </Space>
          <Select
            value={`${sortField}-${sortOrder}`}
            onChange={handleSortChange}
            style={{ width: "100%", marginTop: "8px" }}
          >
            <Select.Option value="name-ascend">Tên A-Z</Select.Option>
            <Select.Option value="name-descend">Tên Z-A</Select.Option>
            <Select.Option value="createdAt-descend">Mới nhất</Select.Option>
            <Select.Option value="createdAt-ascend">Cũ nhất</Select.Option>
          </Select>
        </Col>

        <Col span={4}>
          <Button onClick={onClearFilters} style={{ marginTop: "32px" }} block>
            Xóa bộ lọc
          </Button>
        </Col>
      </Row>
    </Card>
  );
};
