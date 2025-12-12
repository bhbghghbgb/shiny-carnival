import { FileExcelOutlined, FilePdfOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { exportTablePdf } from '../../../utils/exportPdf';
import { userPageConfig } from '../config/userPageConfig';
import type { UserNoPass } from '../types/entity';

const { Title, Text } = Typography

interface UserHeaderProps {
    users: UserNoPass[];
}

export const UserHeader = ({ users }: UserHeaderProps) => {
    const exportPDF = () => {
        exportTablePdf(userPageConfig,users,"products");
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
                            <TeamOutlined style={{ marginRight: '8px' }} />
                            Quản lý người dùng
                        </Title>
                        <Text type="secondary">
                            Quản lý thông tin và quyền hạn của người dùng trong
                            hệ thống
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        <Button
                            type="primary"
                            size="large"
                            icon={<FileExcelOutlined />}
                            onClick={importExcel}
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
