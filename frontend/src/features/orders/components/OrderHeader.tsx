import { FileExcelOutlined, FilePdfOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { exportTablePdf } from '../../../utils/exportPdf'
import { importTableExcel } from '../../../utils/importExcel'
import { orderPageConfig } from '../config/orderPageConfig'
import { useOrderManagementPage } from '../hooks'
import type { CreateOrderRequest } from '../types/api'
import type { OrderEntity } from '../types/entity'

const { Title, Text } = Typography

interface OrderHeaderProps {
    orders: OrderEntity[]
}

export const OrderHeader = ({ orders }: OrderHeaderProps) => {
    const {createOrder} = useOrderManagementPage()

    const exportPDF = () => {
        exportTablePdf(orderPageConfig,orders,"orders");
    };
    const importExcel = async (file: File) => {
        await importTableExcel(file, payload => 
            createOrder.mutateAsync({
                ...(payload as CreateOrderRequest),
            })
        );
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
                            <ShoppingCartOutlined style={{ marginRight: '8px' }} />
                            Quản lý đơn hàng
                        </Title>
                        <Text type="secondary">
                            Quản lý đơn hàng, trạng thái và lịch sử giao dịch
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                    <input
                            id="importExcelInput"
                            type="file"
                            accept=".xlsx, .xls"
                            style={{ display: "none" }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) importExcel(file);
                            }}
                        />
                    <Button
                            type="primary"
                            size="large"
                            icon={<FileExcelOutlined />}
                            onClick={() => document.getElementById("importExcelInput")?.click()}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                background: '#4caf50',
                                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                            }}
                        >
                            Import Excel
                        </Button>
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

