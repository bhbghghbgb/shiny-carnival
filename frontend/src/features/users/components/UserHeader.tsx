import { FileExcelOutlined, FilePdfOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import type { UserRole } from '../../../config/api.config';
import { exportTablePdf } from '../../../utils/exportPdf';
import { importTableExcel } from '../../../utils/importExcel';
import type { CreateUserRequest } from '../api';
import { userPageConfig } from '../config/userPageConfig';
import { useUserManagementPage } from '../hooks/useUserManagementPage';
import type { UserNoPass } from '../types/entity';

const { Title, Text } = Typography

interface UserHeaderProps {
    users: UserNoPass[];
}

export const UserHeader = ({ users }: UserHeaderProps) => {
    const {createUser} = useUserManagementPage()
    const mapRoleFromExcel = (role: string): UserRole => {
        const value = role.trim().toLowerCase();
        if (['admin', '0'].includes(value)) return 0;
        if (['staff', '1'].includes(value)) return 1;
        throw new Error(`Role không hợp lệ: ${role}`);
      };
      

    const exportPDF = () => {
        exportTablePdf(userPageConfig,users,"users");
    };
    const importExcel = async (file: File) => {
        await importTableExcel(file, payload => 
            createUser.mutateAsync({
                ...(payload as CreateUserRequest),
                password: String(payload.password),
                role: mapRoleFromExcel(payload.role),
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
