import { DatabaseOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { exportTablePdf } from '../../../utils/exportPdf';
import { inventoryPageConfig } from '../config/inventoryPageConfig';
import type { InventoryEntity } from '../types/inventoryEntity';

const { Title, Text } = Typography

interface InventoryHeaderProps {
    inventories: InventoryEntity[];
}

export const InventoryHeader = ({inventories} : InventoryHeaderProps) => {

    const exportPDF = () => {
        exportTablePdf(inventoryPageConfig,inventories,"inventories");
    };
    return (
        <Card
            style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: 'none',
            }}
        >
            <Row justify="space-between" align="middle">
                <Col>
                    <Space direction="vertical" size="small">
                        <Title
                            level={2}
                            style={{ margin: 0, color: '#1890ff' }}
                        >
                            <DatabaseOutlined style={{ marginRight: '8px' }} />
                            Quản lý tồn kho
                        </Title>
                        <Text type="secondary">
                            Quản lý số lượng tồn kho và lịch sử thay đổi
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            icon={<FilePdfOutlined />}
                            onClick={exportPDF}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                background: '#d9534f',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Export PDF
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    )
}

