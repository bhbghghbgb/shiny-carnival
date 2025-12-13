import { FileExcelOutlined, FilePdfOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { exportTablePdf } from '../../../utils/exportPdf'
import { customerPageConfig } from '../config/customerPageConfig'
import type { CustomerEntity } from '../types/entity'

const { Title, Text } = Typography

interface CustomerHeaderProps {
    customers: CustomerEntity[],
}

export const CustomerHeader = ({ customers }: CustomerHeaderProps) => {

    const exportPDF = () => {
        exportTablePdf(customerPageConfig,customers,"customers");
    };
    const importExcel = () =>{

    }
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
                            <UserOutlined style={{ marginRight: '8px' }} />
                            Quản lý khách hàng
                        </Title>
                        <Text type="secondary">
                            Quản lý thông tin khách hàng và lịch sử mua hàng
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
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