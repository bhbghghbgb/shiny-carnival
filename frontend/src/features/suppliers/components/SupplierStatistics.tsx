import { Card, Row, Col, Statistic, Typography } from "antd";
import {
  ShopOutlined,
  MailOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface SupplierStatisticsProps {
  totalSuppliers: number;      // Tổng tất cả nhà cung cấp
  filteredCount: number;       // Tổng số theo kết quả search/filter
  activeSuppliers: number;
  productCount: number;
}

export const SupplierStatistics = ({
  totalSuppliers,
  filteredCount,
  activeSuppliers,
  productCount,
}: SupplierStatisticsProps) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Tổng nhà cung cấp"
              value={totalSuppliers}
              prefix={<ShopOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Nhà cung cấp hoạt động"
              value={activeSuppliers}
              prefix={<MailOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Tổng sản phẩm cung cấp"
              value={productCount}
              prefix={<DollarOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {filteredCount !== totalSuppliers && (
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Text type="secondary">
            🔍 Có <b>{filteredCount}</b> nhà cung cấp khớp với kết quả tìm kiếm
          </Text>
        </div>
      )}
    </>
  );
};
