import { Card, Typography, Button, Space, Empty, Table, InputNumber, Divider } from 'antd';
import { DeleteOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { QRScanner } from './components/QRScanner';
import { useDraftOrderItems, useOrderStore } from '../orders/store/orderStore';
import { useNavigate } from '@tanstack/react-router';
import { ENDPOINTS } from '../../app/routes/type/routes.endpoint';

const { Title, Text } = Typography;

export const QRScannerPage = () => {
    const navigate = useNavigate();
    const draftItems = useDraftOrderItems();
    const { total, count } = useMemo(() => {
        const totals = draftItems.reduce(
            (acc, item) => {
                acc.total += item.subtotal;
                acc.count += item.quantity;
                return acc;
            },
            { total: 0, count: 0 }
        );
        return totals;
    }, [draftItems]);
    const updateDraftQuantity = useOrderStore((state) => state.updateDraftOrderItemQuantity);
    const removeDraftItem = useOrderStore((state) => state.removeDraftOrderItem);
    const clearDraftItems = useOrderStore((state) => state.clearDraftOrder);

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Title level={2}>
                        <QrcodeOutlined /> Quét mã QR sản phẩm
                    </Title>
                    <Text type="secondary">
                        Sử dụng camera để quét mã QR trên sản phẩm và thêm vào đơn hàng
                    </Text>
                </div>

                <Card>
                    <QRScanner />
                </Card>

                <Card
                    title={
                        <Space>
                            <span>Giỏ hàng tạm thời</span>
                            {count > 0 && <Typography.Text type="secondary">({count} sản phẩm)</Typography.Text>}
                        </Space>
                    }
                    extra={
                        count > 0 && (
                            <Space>
                                <Button type="primary" size="small" onClick={() => navigate({ to: ENDPOINTS.ADMIN.ORDERS.CREATE as any })}>
                                    Tạo đơn hàng
                                </Button>
                                <Button danger size="small" onClick={clearDraftItems}>
                                    Xóa tất cả
                                </Button>
                            </Space>
                        )
                    }
                >
                    {draftItems.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Chưa có sản phẩm trong giỏ hàng"
                        />
                    ) : (
                        <>
                            <Table
                                dataSource={draftItems.map((item) => ({ ...item, key: item.productId }))}
                                pagination={false}
                                columns={[
                                    { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
                                    { title: 'Mã vạch', dataIndex: 'barcode', key: 'barcode' },
                                    {
                                        title: 'Đơn giá',
                                        dataIndex: 'price',
                                        key: 'price',
                                        render: (price: number) => `${price.toLocaleString('vi-VN')} đ`,
                                    },
                                    {
                                        title: 'Số lượng',
                                        dataIndex: 'quantity',
                                        key: 'quantity',
                                        render: (_: number, record) => (
                                            <InputNumber
                                                min={1}
                                                value={record.quantity}
                                                onChange={(value) =>
                                                    updateDraftQuantity(record.productId, value || 1)
                                                }
                                                style={{ width: 80 }}
                                            />
                                        ),
                                    },
                                    {
                                        title: 'Thành tiền',
                                        dataIndex: 'subtotal',
                                        key: 'subtotal',
                                        render: (subtotal: number) => `${subtotal.toLocaleString('vi-VN')} đ`,
                                    },
                                    {
                                        title: 'Thao tác',
                                        key: 'action',
                                        render: (_: any, record) => (
                                            <Button
                                                type="link"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => removeDraftItem(record.productId)}
                                            >
                                                Xóa
                                            </Button>
                                        ),
                                    },
                                ]}
                            />
                            <Divider style={{ margin: '12px 0' }} />
                            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                <Typography.Text strong>Tổng cộng</Typography.Text>
                                <Typography.Title level={4} style={{ margin: 0 }}>
                                    {total.toLocaleString('vi-VN')} đ
                                </Typography.Title>
                            </Space>
                        </>
                    )}
                </Card>
            </Space>
        </div>
    );
};
