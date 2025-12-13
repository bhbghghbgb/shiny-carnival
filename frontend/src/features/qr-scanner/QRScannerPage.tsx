import { Card, Typography, List, Button, Space, Empty, Table, InputNumber, Divider } from 'antd';
import { DeleteOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useState, useEffect, useMemo } from 'react';
import { QRScanner } from './components/QRScanner';
import type { ProductEntity } from '../products/types/entity';
import { useDraftOrderItems, useOrderStore } from '../orders/store';
import { useNavigate } from '@tanstack/react-router';
import { ENDPOINTS } from '../../app/routes/type/routes.endpoint';

const { Title, Text } = Typography;

export const QRScannerPage = () => {
    const navigate = useNavigate();
    const [scannedProducts, setScannedProducts] = useState<ProductEntity[]>([]);
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
    const updateDraftQuantity = useOrderStore((state) => state.updateDraftQuantity);
    const removeDraftItem = useOrderStore((state) => state.removeDraftItem);
    const clearDraftItems = useOrderStore((state) => state.clearDraftItems);

    // Load từ localStorage khi component mount
    useEffect(() => {
        loadScannedProducts();
    }, []);

    const loadScannedProducts = () => {
        const products = JSON.parse(
            localStorage.getItem('scanned_products') || '[]'
        ) as ProductEntity[];
        setScannedProducts(products);
    };

    const handleScanSuccess = () => {
        loadScannedProducts();
    };

    const clearHistory = () => {
        localStorage.removeItem('scanned_products');
        setScannedProducts([]);
    };

    const removeProduct = (productId: number) => {
        const products = scannedProducts.filter((p) => p.id !== productId);
        localStorage.setItem('scanned_products', JSON.stringify(products));
        setScannedProducts(products);
    };

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Title level={2}>
                        <QrcodeOutlined /> Quét mã QR sản phẩm
                    </Title>
                    <Text type="secondary">
                        Sử dụng camera để quét mã QR trên sản phẩm và xem thông tin chi tiết
                    </Text>
                </div>

                <Card>
                    <QRScanner onScanSuccess={handleScanSuccess} />
                </Card>

                <Card
                    title={
                        <Space>
                            <span>Đơn hàng tạm thời</span>
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
                            description="Chưa có sản phẩm trong đơn tạm"
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

                <Card
                    title={
                        <Space>
                            <span>Lịch sử quét</span>
                            {scannedProducts.length > 0 && (
                                <Text type="secondary">({scannedProducts.length} sản phẩm)</Text>
                            )}
                        </Space>
                    }
                    extra={
                        scannedProducts.length > 0 && (
                            <Button danger onClick={clearHistory} size="small">
                                Xóa tất cả
                            </Button>
                        )
                    }
                >
                    {scannedProducts.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Chưa có sản phẩm nào được quét"
                        />
                    ) : (
                        <List
                            dataSource={scannedProducts}
                            renderItem={(product: any) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            key="delete"
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeProduct(product.id)}
                                        >
                                            Xóa
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<strong>{product.name || product.productName}</strong>}
                                        description={
                                            <Space direction="vertical" size="small">
                                                <Text>Mã: {product.barcode || 'N/A'}</Text>
                                                <Text>
                                                    Giá: <strong>{product.price?.toLocaleString('vi-VN')} đ</strong>
                                                </Text>
                                                <Text type="secondary">
                                                    Tồn kho: {product.stockQuantity || 0}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Quét lúc: {new Date(product.lastScanned).toLocaleString('vi-VN')}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            </Space>
        </div>
    );
};
