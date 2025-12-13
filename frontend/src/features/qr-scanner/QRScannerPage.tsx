import { Card, Typography, List, Button, Space, Empty } from 'antd';
import { DeleteOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { QRScanner } from './components/QRScanner';
import type { ProductEntity } from '../products/types/entity';

const { Title, Text } = Typography;

export const QRScannerPage = () => {
    const [scannedProducts, setScannedProducts] = useState<ProductEntity[]>([]);

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
