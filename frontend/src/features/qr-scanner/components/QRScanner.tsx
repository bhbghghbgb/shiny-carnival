import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button, message, Space, Alert } from 'antd';
import { CameraOutlined, CloseOutlined } from '@ant-design/icons';
import { productApiService } from '../../products/api/ProductApiService';
import type { ProductEntity } from '../../products/types/entity';
import { useOrderStore } from '../../orders/store/orderStore';

interface QRScannerProps {
    onScanSuccess?: (product: ProductEntity) => void;
    onScanError?: (error: string) => void;
}

export const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const addDraftItem = useOrderStore((state) => state.addDraftOrderItem);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const isProcessingRef = useRef(false);
    const lastScannedRef = useRef<string>('');
    const qrCodeRegionId = 'qr-reader';

    const stopScanning = async () => {
        if (scannerRef.current && isScanning) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
                scannerRef.current = null;
                setIsScanning(false);
                messageApi.info('Đã dừng quét');
            } catch (err) {
                console.error('Error:', err);
            }
        }
    };

    const handleScan = async (decodedText: string) => {
        // Ngăn không cho xử lý nếu đang xử lý một mã khác
        if (isProcessingRef.current) {
            return;
        }

        // Bỏ qua nếu là cùng mã vừa quét trong vòng 3 giây
        if (lastScannedRef.current === decodedText) {
            return;
        }

        // Đánh dấu đang xử lý
        isProcessingRef.current = true;
        lastScannedRef.current = decodedText;

        console.log('QR Code detected:', decodedText);
        messageApi.info(`Đã quét được: ${decodedText}`, 2);

        try {
            messageApi.loading('Đang tìm kiếm sản phẩm...', 0);
            const products = await productApiService.searchByBarcode(decodedText);

            if (products.length === 0) {
                messageApi.destroy();
                messageApi.warning('Không tìm thấy sản phẩm với mã vạch này');
                // Reset sau 2 giây
                setTimeout(() => {
                    isProcessingRef.current = false;
                    lastScannedRef.current = '';
                }, 2000);
                return;
            }

            const product = products[0];
            messageApi.destroy();
            messageApi.success(`Đã quét: ${product.productName}`);

            // Tạo DraftOrderItem từ ProductEntity
            const draftItem = {
                productId: product.id,
                productName: product.productName,
                categoryName: (product as any).categoryName || '',
                barcode: product.barcode,
                price: product.price,
                quantity: 1, // Mặc định 1
                subtotal: product.price * 1,
            };

            // Lưu vào draft order (global state + localStorage via persist)
            addDraftItem(draftItem);

            // Delay 1 giây trước khi dừng để hiển thị thông báo
            await new Promise(resolve => setTimeout(resolve, 1000));

            onScanSuccess?.(product);
            await stopScanning();
        } catch (error) {
            messageApi.destroy();
            messageApi.error('Lỗi khi tìm kiếm sản phẩm. Vui lòng thử lại.');
            console.error('Error searching product:', error);
        } finally {
            // Reset trạng thái sau 3 giây để có thể quét lại
            setTimeout(() => {
                isProcessingRef.current = false;
                lastScannedRef.current = '';
            }, 3000);
        }
    };

    const startScanning = async () => {
        try {
            // Reset trạng thái khi bắt đầu quét
            isProcessingRef.current = false;
            lastScannedRef.current = '';

            const html5QrCode = new Html5Qrcode(qrCodeRegionId);
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 300 }, // Giảm fps từ 30 xuống 10 để tránh quét quá nhanh
                handleScan,
                () => { }
            );

            setIsScanning(true);
            messageApi.success('Camera sẵn sàng!');
        } catch (err) {
            console.error('Camera error:', err);
            messageApi.error('Không thể khởi động camera');
            setIsScanning(false);
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { });
            }
        };
    }, []);

    return (
        <>
            {contextHolder}
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space>
                    {!isScanning ? (
                        <Button type="primary" icon={<CameraOutlined />} onClick={startScanning} size="large">
                            Bật camera
                        </Button>
                    ) : (
                        <Button danger icon={<CloseOutlined />} onClick={stopScanning} size="large">
                            Dừng
                        </Button>
                    )}
                </Space>

                {isScanning && <Alert message="Đang quét..." type="info" showIcon />}

                <div
                    id={qrCodeRegionId}
                    style={{
                        width: '100%',
                        maxWidth: 600,
                        margin: '0 auto',
                        border: '3px solid #1890ff',
                        borderRadius: 12,
                        backgroundColor: '#000',
                        minHeight: 400
                    }}
                />
            </Space>
        </>
    );
};
