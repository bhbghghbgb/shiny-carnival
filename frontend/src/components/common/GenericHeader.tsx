// frontend/src/components/common/GenericHeader.tsx
import { Button, Card, Row, Col, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { GenericPageConfig } from '../../types/generic-page';

const { Title, Text } = Typography;

interface GenericHeaderProps<T> {
    config: GenericPageConfig<T>;
    onAddItem: () => void;
    customActions?: React.ReactNode;
}

export const GenericHeader = <T,>({
    config,
    onAddItem,
    customActions,
}: GenericHeaderProps<T>) => {
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
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            {config.title}
                        </Title>
                        <Text type="secondary">
                            Quản lý thông tin {config.entityName} trong hệ thống
                        </Text>
                    </Space>
                </Col>
                <Col>
                    <Space>
                        {customActions && <>{customActions}</>}
                        {config.enableCreate !== false && (
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={onAddItem}
                                style={{
                                    borderRadius: '8px',
                                    height: '40px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                                }}
                            >
                                Thêm
                            </Button>
                        )}
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};